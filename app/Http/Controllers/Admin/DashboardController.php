<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPatients = Patient::count();
        $todayAppointments = Appointment::where('appointment_date', Carbon::today())->count();
        $activeStaff = User::where('role', 'staff')->count();
        $systemHealth = 99;

        // Appointments by day (last 7 days)
        $appointmentsByDay = [];
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $appointmentsByDay[] = Appointment::whereDate('appointment_date', $date)->count();
        }

        // Patient growth by month (last 8 months)
        $patientsByMonth = [];
        $months = [];
        for ($i = 7; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = $date->format('M');
            $patientsByMonth[] = Patient::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
        }

        $recentAppointments = Appointment::with('patient', 'dentist.user')
            ->orderBy('appointment_date', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($apt) => [
                'id' => $apt->id,
                'patient' => $apt->patient->full_name,
                'dentist' => $apt->dentist->user->name,
                'date' => $apt->appointment_date->format('M d, Y'),
                'time' => $apt->appointment_time,
                'status' => $apt->status,
                'type' => $apt->type,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'totalPatients' => $totalPatients,
            'todayAppointments' => $todayAppointments,
            'activeStaff' => $activeStaff,
            'systemHealth' => $systemHealth,
            'appointmentsByDay' => $appointmentsByDay,
            'days' => $days,
            'patientsByMonth' => $patientsByMonth,
            'months' => $months,
            'recentAppointments' => $recentAppointments,
        ]);
    }
}
