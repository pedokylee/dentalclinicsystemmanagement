<?php

namespace App\Http\Controllers\Patient;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Appointment;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $patient = $user->patient;

        $nextAppointment = null;
        $notifications = [];

        if ($patient) {
            $nextAppointment = Appointment::where('patient_id', $patient->id)
                ->where('appointment_date', '>=', Carbon::today())
                ->with('dentist.user')
                ->orderBy('appointment_date')
                ->first();

            // Generate mock notifications
            $notifications = [
                ['type' => 'reminder', 'message' => 'Your appointment is in 2 days'],
                ['type' => 'alert', 'message' => 'You have pending treatment follow-up'],
            ];
        }

        return Inertia::render('Patient/Dashboard', [
            'nextAppointment' => $nextAppointment,
            'notifications' => $notifications,
        ]);
    }
}
