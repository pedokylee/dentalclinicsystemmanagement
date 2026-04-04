<?php

namespace App\Http\Controllers\Patient;

use App\Models\Appointment;
use App\Models\TreatmentRecord;
use App\Models\Patient;
use Inertia\Inertia;
use Illuminate\Routing\Controller;

class HistoryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $patient = $user->patient;

        if (!$patient) {
            return back()->with('error', 'No patient profile found.');
        }

        $appointments = Appointment::where('patient_id', $patient->id)
            ->with('dentist')
            ->orderBy('appointment_date', 'desc')
            ->paginate(10);

        $treatments = TreatmentRecord::where('patient_id', $patient->id)
            ->with('dentist')
            ->orderBy('treatment_date', 'desc')
            ->paginate(10);

        return Inertia::render('Patient/History', [
            'appointments' => $appointments,
            'treatments' => $treatments
        ]);
    }

    public function download($id)
    {
        $treatment = TreatmentRecord::with('patient', 'dentist')->findOrFail($id);
        
        // Check authorization
        if ($treatment->patient_id !== auth()->user()->patient->id) {
            abort(403, 'Unauthorized');
        }

        $pdf = \PDF::loadView('pdf.treatment_record', ['treatment' => $treatment]);
        
        return $pdf->download("treatment_record_{$id}.pdf");
    }
}
