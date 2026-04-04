<?php

namespace App\Http\Controllers\Staff;

use App\Models\Appointment;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AuditLog;
use Carbon\Carbon;

class CheckinController extends Controller
{
    public function index()
    {
        $appointments = Appointment::where('appointment_date', Carbon::today())
            ->where('status', '!=', 'cancelled')
            ->with('patient', 'dentist.user')
            ->orderBy('appointment_time')
            ->get();

        return Inertia::render('Staff/Checkin/Index', ['appointments' => $appointments]);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $appointment->update(['status' => 'confirmed']);
        AuditLog::log('checked_in', 'appointments', "Checked in patient ID: {$appointment->patient_id}");

        return back()->with('success', 'Patient checked in successfully.');
    }
}
