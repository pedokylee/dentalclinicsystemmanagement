<?php

namespace App\Http\Controllers\Dentist;

use App\Http\Controllers\Controller;
use App\Models\TreatmentRecord;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\TreatmentRecordAttachment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TreatmentController extends Controller
{
    public function create()
    {
        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');

        $patients = Patient::whereIn('id', function ($query) use ($dentist) {
            $query->select('patient_id')
                ->from('appointments')
                ->where('dentist_id', $dentist->id)
                ->distinct();
        })->get(['id', 'first_name', 'last_name', 'date_of_birth']);

        return Inertia::render('Dentist/Treatment/Create', [
            'patients' => $patients,
            'procedureOptions' => config('clinic.procedures'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'visit_date' => 'required|date',
            'procedures' => 'nullable|array',
            'procedures.*' => 'in:extraction,filling,crown,root_canal,cleaning,whitening,root_planing,scaling,polishing',
            'notes' => 'nullable|string',
            'prescription' => 'nullable|string',
            'tooth_data' => 'nullable',
            'xrays.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'procedure_photos.*' => 'nullable|image|max:5120',
        ]);

        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');

        $toothData = $request->input('tooth_data');
        if (is_string($toothData) && filled($toothData)) {
            $decoded = json_decode($toothData, true);
            $toothData = json_last_error() === JSON_ERROR_NONE ? $decoded : null;
        }

        $record = DB::transaction(function () use ($validated, $dentist, $request, $toothData) {
            $record = TreatmentRecord::create([
                'patient_id' => $validated['patient_id'],
                'visit_date' => $validated['visit_date'],
                'procedures' => $validated['procedures'] ?? [],
                'notes' => $validated['notes'] ?? null,
                'prescription' => $validated['prescription'] ?? null,
                'tooth_data' => $toothData,
                'dentist_id' => $dentist->id,
                'appointment_id' => Appointment::query()
                    ->where('patient_id', $validated['patient_id'])
                    ->where('dentist_id', $dentist->id)
                    ->whereDate('appointment_date', $validated['visit_date'])
                    ->value('id'),
            ]);

            $this->storeAttachments($request, $record);

            return $record;
        });

        AuditLog::log('created', 'treatment_records', "Created treatment record for patient ID: {$validated['patient_id']}");

        return redirect('/dentist/patients/' . $validated['patient_id'])->with('success', 'Treatment record created.');
    }

    public function edit(TreatmentRecord $treatment)
    {
        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');
        if ($treatment->dentist_id !== $dentist->id) {
            abort(403);
        }

        return Inertia::render('Dentist/Treatment/Edit', [
            'treatment' => $treatment->load('attachments'),
            'procedureOptions' => config('clinic.procedures'),
        ]);
    }

    public function update(Request $request, TreatmentRecord $treatment)
    {
        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');
        if ($treatment->dentist_id !== $dentist->id) {
            abort(403);
        }

        $validated = $request->validate([
            'visit_date' => 'required|date',
            'procedures' => 'nullable|array',
            'procedures.*' => 'in:extraction,filling,crown,root_canal,cleaning,whitening,root_planing,scaling,polishing',
            'notes' => 'nullable|string',
            'prescription' => 'nullable|string',
            'tooth_data' => 'nullable',
            'xrays.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'procedure_photos.*' => 'nullable|image|max:5120',
        ]);

        $toothData = $request->input('tooth_data');
        if (is_string($toothData) && filled($toothData)) {
            $decoded = json_decode($toothData, true);
            $toothData = json_last_error() === JSON_ERROR_NONE ? $decoded : null;
        }

        DB::transaction(function () use ($treatment, $validated, $toothData, $request) {
            $treatment->update([
                'visit_date' => $validated['visit_date'],
                'procedures' => $validated['procedures'] ?? [],
                'notes' => $validated['notes'] ?? null,
                'prescription' => $validated['prescription'] ?? null,
                'tooth_data' => $toothData,
            ]);

            $this->storeAttachments($request, $treatment);
        });

        AuditLog::log('updated', 'treatment_records', "Updated treatment record ID: {$treatment->id}");

        return redirect('/dentist/patients/' . $treatment->patient_id)->with('success', 'Treatment record updated.');
    }

    public function exportPdf(TreatmentRecord $treatment)
    {
        $dentist = auth()->user()->dentist ?? abort(403, 'Dentist profile not configured.');

        if ($treatment->dentist_id !== $dentist->id) {
            abort(403);
        }

        $treatment->load(['patient', 'dentist.user', 'attachments']);

        AuditLog::log('exported', 'treatment_records', "Dentist exported treatment record ID: {$treatment->id}");

        return Pdf::loadView('pdf.treatment_record', ['record' => $treatment])
            ->download("treatment-record-{$treatment->id}.pdf");
    }

    private function storeAttachments(Request $request, TreatmentRecord $record): void
    {
        foreach ($request->file('xrays', []) as $file) {
            $path = $file->store("treatment-records/{$record->id}/xrays", 'public');
            $record->attachments()->create([
                'type' => 'xray',
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);
        }

        foreach ($request->file('procedure_photos', []) as $file) {
            $path = $file->store("treatment-records/{$record->id}/photos", 'public');
            $record->attachments()->create([
                'type' => 'procedure_photo',
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);
        }
    }
}
