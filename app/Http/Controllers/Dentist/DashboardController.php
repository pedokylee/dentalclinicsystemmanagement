<?php

namespace App\Http\Controllers\Dentist;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Appointment;
use App\Models\TreatmentRecord;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $dentist = $user->dentist;

        $todaySchedule = Appointment::where('dentist_id', $dentist->id)
            ->where('appointment_date', Carbon::today())
            ->with('patient')
            ->orderBy('appointment_time')
            ->get()
            ->map(fn($apt) => [
                'id' => $apt->id,
                'patient' => $apt->patient->full_name,
                'time' => $apt->appointment_time,
                'type' => $apt->type,
            ]);

        $pendingNotes = TreatmentRecord::where('dentist_id', $dentist->id)
            ->whereNull('notes')
            ->count();

        $myPatientsCount = Appointment::where('dentist_id', $dentist->id)
            ->distinct('patient_id')
            ->count('patient_id');

        return Inertia::render('Dentist/Dashboard', [
            'todaySchedule' => $todaySchedule,
            'pendingNotes' => $pendingNotes,
            'myPatientsCount' => $myPatientsCount,
        ]);
    }
}
