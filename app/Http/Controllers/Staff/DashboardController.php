<?php

namespace App\Http\Controllers\Staff;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Appointment;

class DashboardController extends Controller
{
    public function index()
    {
        $checkInQueue = Appointment::where('appointment_date', Carbon::today())
            ->where('status', 'pending')
            ->with('patient', 'dentist.user')
            ->orderBy('appointment_time')
            ->get()
            ->map(fn($apt) => [
                'id' => $apt->id,
                'patient' => $apt->patient->full_name,
                'time' => $apt->appointment_time,
                'dentist' => $apt->dentist->user->name,
            ]);

        $walkInCount = rand(0, 10);
        $remindersToSend = Appointment::where('appointment_date', Carbon::tomorrow())
            ->count();

        return Inertia::render('Staff/Dashboard', [
            'checkInQueue' => $checkInQueue,
            'walkInCount' => $walkInCount,
            'remindersToSend' => $remindersToSend,
        ]);
    }
}
