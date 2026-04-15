<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Notification;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $patient = $user->patient;

        $nextAppointment = null;
        $notifications = collect();

        if ($patient) {
            $nextAppointment = Appointment::where('patient_id', $patient->id)
                ->where('status', '!=', 'cancelled')
                ->where('appointment_date', '>=', Carbon::today())
                ->with('dentist.user')
                ->orderBy('appointment_date')
                ->orderBy('appointment_time')
                ->first();

            $notifications = Notification::where('user_id', $user->id)
                ->latest()
                ->limit(5)
                ->get();
        }

        return Inertia::render('Patient/Dashboard', [
            'nextAppointment' => $nextAppointment,
            'notifications' => $notifications,
        ]);
    }
}
