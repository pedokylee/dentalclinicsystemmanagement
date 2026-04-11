<?php

namespace App\Http\Controllers\Admin;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Dentist;
use App\Models\Notification;
use App\Mail\AppointmentBooked;
use App\Models\AuditLog;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Helpers\ClinicHelper;

class AppointmentController extends Controller
{
    public function create()
    {
        $patients = Patient::all(['id', 'first_name', 'last_name']);
        $dentists = Dentist::with('user:id,name')->get(['id', 'user_id']);

        // Generate available time slots using clinic config
        $timeSlots = ClinicHelper::generateTimeSlots();

        return Inertia::render('Admin/Appointments/Create', [
            'patients' => $patients,
            'dentists' => $dentists,
            'timeSlots' => $timeSlots,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'dentist_id' => 'required|exists:dentists,id',
            'appointment_date' => 'required|date|after:today',
            'appointment_time' => 'required|date_format:H:i',
            'type' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Check for conflicts
        $conflict = Appointment::where('dentist_id', $validated['dentist_id'])
            ->where('appointment_date', $validated['appointment_date'])
            ->where('appointment_time', $validated['appointment_time'])
            ->exists();

        if ($conflict) {
            return back()->with('error', 'This dentist already has an appointment at that date/time.');
        }

        $appointment = Appointment::create([
            ...$validated,
            'status' => 'pending',
        ]);

        // Get related models
        $patient = Patient::find($validated['patient_id']);
        $dentist = Dentist::find($validated['dentist_id']);

        // Send email to dentist
        Mail::to($dentist->user->email)->send(new AppointmentBooked($appointment, 'dentist'));

        // Send email to patient
        Mail::to($patient->email)->send(new AppointmentBooked($appointment, 'patient'));

        // Notify the dentist (in-app)
        Notification::create([
            'user_id' => $dentist->user_id,
            'type' => 'appointment_booked',
            'related_id' => $appointment->id,
            'title' => 'New Appointment Booked',
            'message' => "New appointment booked for {$patient->full_name} on {$appointment->appointment_date->format('F d, Y')} at {$appointment->appointment_time} ({$appointment->type})",
            'read' => false,
        ]);

        // Notify the patient (in-app)
        Notification::create([
            'user_id' => $patient->user_id,
            'type' => 'appointment_booked',
            'related_id' => $appointment->id,
            'title' => 'Appointment Booked',
            'message' => "Your appointment has been booked for {$appointment->appointment_date->format('F d, Y')} at {$appointment->appointment_time} with {$dentist->user->name} ({$appointment->type})",
            'read' => false,
        ]);

        AuditLog::log('created', 'appointments', "Booked appointment for patient ID: {$validated['patient_id']}");

        return redirect('/admin/dashboard')->with('success', 'Appointment booked successfully. Patient and dentist notified via email and in-app.');
    }
}
