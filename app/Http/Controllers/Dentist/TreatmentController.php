<?php

namespace App\Http\Controllers\Dentist;

use App\Models\TreatmentRecord;
use App\Models\Patient;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AuditLog;

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

        return Inertia::render('Dentist/Treatment/Create', ['patients' => $patients]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'visit_date' => 'required|date',
            'procedures' => 'nullable|array',
            'procedures.*' => 'in:extraction,filling,crown,root_canal,cleaning,whitening,root_planing',
            'notes' => 'nullable|string',
            'prescription' => 'nullable|string',
            'tooth_data' => 'nullable|json',
        ]);

        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');

        $record = TreatmentRecord::create([
            ...$validated,
            'dentist_id' => $dentist->id,
        ]);

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

        return Inertia::render('Dentist/Treatment/Edit', ['treatment' => $treatment]);
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
            'procedures.*' => 'in:extraction,filling,crown,root_canal,cleaning,whitening,root_planing',
            'notes' => 'nullable|string',
            'prescription' => 'nullable|string',
            'tooth_data' => 'nullable|json',
        ]);

        $treatment->update($validated);

        AuditLog::log('updated', 'treatment_records', "Updated treatment record ID: {$treatment->id}");

        return redirect('/dentist/patients/' . $treatment->patient_id)->with('success', 'Treatment record updated.');
    }
}
