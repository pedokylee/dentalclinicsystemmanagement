<?php

namespace App\Http\Controllers\Dentist;

use App\Models\Appointment;
use App\Models\Notification;
use App\Mail\AppointmentCancelled;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $dentist = $user->dentist;

        $appointments = Appointment::where('dentist_id', $dentist->id)
            ->with('patient')
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->get()
            ->map(fn($apt) => [
                'id' => $apt->id,
                'title' => $apt->patient->full_name,
                'start' => $apt->appointment_date->format('Y-m-d') . 'T' . $apt->appointment_time,
                'type' => $apt->type,
                'status' => $apt->status,
            ]);

        return Inertia::render('Dentist/Appointments/Index', ['appointments' => $appointments]);
    }

    public function destroy(Appointment $appointment)
    {
        $user = auth()->user();
        $dentist = $user->dentist;

        // Verify this appointment belongs to the dentist
        if ($appointment->dentist_id !== $dentist->id) {
            abort(403, 'Unauthorized access to this appointment.');
        }

        // Can't cancel past appointments
        if ($appointment->appointment_date < now()->format('Y-m-d')) {
            return back()->with('error', 'Cannot cancel past appointments.');
        }

        $appointment->update(['status' => 'cancelled']);

        // Send email notification to patient
        $patient = $appointment->patient;
        Mail::to($patient->email)->send(new AppointmentCancelled($appointment, 'Cancelled by dentist'));

        // Create in-app notification for patient
        Notification::create([
            'user_id' => $patient->user_id,
            'type' => 'appointment_cancelled',
            'related_id' => $appointment->id,
            'title' => 'Appointment Cancelled',
            'message' => "Your appointment on {$appointment->appointment_date->format('F d, Y')} at {$appointment->appointment_time} with {$dentist->user->name} has been cancelled.",
            'read' => false,
        ]);

        // Notify all staff members
        $staffUsers = \App\Models\User::where('role', 'staff')->get();
        foreach ($staffUsers as $staffUser) {
            Notification::create([
                'user_id' => $staffUser->id,
                'type' => 'appointment_cancelled',
                'related_id' => $appointment->id,
                'title' => 'Appointment Cancelled',
                'message' => "Appointment #{$appointment->id} for {$patient->full_name} on {$appointment->appointment_date->format('F d, Y')} at {$appointment->appointment_time} with {$dentist->user->name} has been cancelled by the dentist.",
                'read' => false,
            ]);
        }

        AuditLog::log('cancelled', 'appointments', "Dentist cancelled appointment ID: {$appointment->id}");

        return back()->with('success', 'Appointment cancelled successfully. Patient and staff notified.');
    }
}
