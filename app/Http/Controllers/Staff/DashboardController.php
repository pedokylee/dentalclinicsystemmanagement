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
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        // Today's check-in queue
        $checkInQueue = Appointment::where('appointment_date', $today)
            ->where('status', '!=', 'cancelled')
            ->with('patient', 'dentist.user')
            ->orderBy('appointment_time')
            ->get()
            ->map(fn($apt) => [
                'id' => $apt->id,
                'patient' => $apt->patient->full_name ?? 'Unknown Patient',
                'time' => $apt->appointment_time,
                'dentist' => $apt->dentist->user->name,
                'type' => $apt->type,
                'status' => $apt->status,
            ]);

        // Count today's check-ins and remaining
        $todayCheckIns = $checkInQueue->count();
        $remainingCheckIns = $checkInQueue->where('status', '!=', 'confirmed')->count();

        // Walk-ins (for demo)
        $walkInCount = 3;
        $waitingWalkIns = 1;

        // Reminders to send for tomorrow
        $remindersToSend = Appointment::where('appointment_date', $tomorrow)
            ->where('status', '!=', 'cancelled')
            ->count();

        return Inertia::render('Staff/Dashboard', [
            'todayCheckIns' => $todayCheckIns,
            'remainingCheckIns' => $remainingCheckIns,
            'checkInQueue' => $checkInQueue,
            'walkInCount' => $walkInCount,
            'waitingWalkIns' => $waitingWalkIns,
            'remindersToSend' => $remindersToSend,
        ]);
    }
}
