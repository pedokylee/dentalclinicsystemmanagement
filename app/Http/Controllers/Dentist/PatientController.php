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
        $dentist = $user->dentist;

        $patients = Patient::whereIn('id', function ($query) use ($dentist) {
            $query->select('patient_id')
                ->from('appointments')
                ->where('dentist_id', $dentist->id)
                ->distinct();
        })
        ->paginate(15)
        ->withQueryString();

        return Inertia::render('Dentist/Patients/Index', ['patients' => $patients]);
    }

    public function show(Patient $patient)
    {
        $user = auth()->user();
        $dentist = $user->dentist;

        // Verify this patient is assigned to the dentist
        $hasAppointment = Appointment::where('patient_id', $patient->id)
            ->where('dentist_id', $dentist->id)
            ->exists();

        if (!$hasAppointment) {
            abort(403, 'Unauthorized access to this patient.');
        }

        $treatmentHistory = $patient->treatmentRecords()
            ->where('dentist_id', $dentist->id)
            ->orderBy('visit_date', 'desc')
            ->get();

        return Inertia::render('Dentist/Patients/Show', [
            'patient' => $patient,
            'treatmentHistory' => $treatmentHistory,
        ]);
    }

    public function exportPdf()
    {
        $user = auth()->user();
        $dentist = $user->dentist;

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
        $dentist = $user->dentist;

        return Excel::download(
            new DentistPatientsExport($dentist->id),
            'dentist-patients-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }
}
