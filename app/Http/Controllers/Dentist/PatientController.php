<?php

namespace App\Http\Controllers\Dentist;

use App\Models\Patient;
use App\Models\Appointment;
use App\Exports\DentistPatientsExport;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class PatientController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');

        $patients = Patient::whereIn('id', function ($query) use ($dentist) {
            $query->select('patient_id')
                ->from('appointments')
                ->where('dentist_id', $dentist->id)
                ->distinct();
        })
        ->paginate(config('app.pagination.patients'))
        ->withQueryString();

        return Inertia::render('Dentist/Patients/Index', ['patients' => $patients]);
    }

    public function show(Patient $patient)
    {
        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');

        // Verify this patient is assigned to the dentist
        $hasAppointment = Appointment::where('patient_id', $patient->id)
            ->where('dentist_id', $dentist->id)
            ->exists();

        if (!$hasAppointment) {
            abort(403, 'Unauthorized access to this patient');
        }

        $treatmentHistory = $patient->treatmentRecords()
            ->where('dentist_id', $dentist->id)
            ->with('attachments')
            ->orderBy('visit_date', 'desc')
            ->get();

        $appointments = Appointment::where('patient_id', $patient->id)
            ->where('dentist_id', $dentist->id)
            ->with('dentist.user')
            ->orderByDesc('appointment_date')
            ->get();

        $xrays = $treatmentHistory
            ->flatMap(fn ($record) => $record->attachments->where('type', 'xray'))
            ->values();

        $prescriptions = $treatmentHistory
            ->filter(fn ($record) => filled($record->prescription))
            ->values();

        return Inertia::render('Dentist/Patients/Show', [
            'patient' => $patient,
            'treatmentHistory' => $treatmentHistory,
            'appointments' => $appointments,
            'xrays' => $xrays,
            'prescriptions' => $prescriptions,
        ]);
    }

    public function exportPdf()
    {
        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');

        $patients = Patient::whereIn('id', function ($query) use ($dentist) {
            $query->select('patient_id')
                ->from('appointments')
                ->where('dentist_id', $dentist->id)
                ->distinct();
        })->get();

        $pdf = Pdf::loadView('pdf.dentist_patients', compact('patients'));
        return $pdf->download('dentist-patients-' . now()->format('Y-m-d-His') . '.pdf');
    }

    public function exportExcel()
    {
        $user = auth()->user();
        $dentist = $user->dentist ?? abort(403, 'Dentist profile not configured.');

        return Excel::download(
            new DentistPatientsExport($dentist->id),
            'dentist-patients-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }
}
