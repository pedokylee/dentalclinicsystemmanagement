<?php

namespace App\Http\Controllers\Staff;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Dentist;
use App\Models\Notification;
use App\Mail\AppointmentBooked;
use App\Jobs\SendAppointmentReminderJob;
use App\Models\AuditLog;
use App\Exports\AppointmentsExport;
use App\Support\AppointmentAvailability;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Mail;
use App\Helpers\ClinicHelper;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = Appointment::with('patient', 'dentist.user')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim()->toString();
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery->whereHas('patient', function ($patientQuery) use ($search) {
                        $patientQuery
                            ->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    })->orWhere('id', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('dentist') && $request->query('dentist') !== 'all', function ($query) use ($request) {
                $query->where('dentist_id', $request->query('dentist'));
            })
            ->when($request->filled('date'), function ($query) use ($request) {
                $query->whereDate('appointment_date', $request->query('date'));
            })
            ->when($request->filled('status') && $request->query('status') !== 'all', function ($query) use ($request) {
                $query->where('status', $request->query('status'));
            })
            ->orderBy('appointment_date', 'desc')
            ->paginate(config('app.pagination.appointments'))
            ->withQueryString();

        $dentists = Dentist::with('user:id,name,active')->get(['id', 'user_id', 'specialization', 'schedule_days']);

        return Inertia::render('Staff/Appointments/Index', [
            'appointments' => $appointments,
            'dentists' => $dentists,
            'filters' => $request->only(['search', 'dentist', 'date', 'status']),
        ]);
    }

    public function create()
    {
        $patients = Patient::all([
            'id',
            'first_name',
            'last_name',
            'date_of_birth',
            'email',
            'contact_number',
            'phone',
        ]);
        $dentists = Dentist::with('user:id,name,active')->get(['id', 'user_id', 'specialization', 'schedule_days']);

        // Generate available time slots using clinic config
        $timeSlots = ClinicHelper::generateTimeSlots();

        return Inertia::render('Staff/Appointments/Create', [
            'patients' => $patients,
            'dentists' => $dentists,
            'timeSlots' => $timeSlots,
            'existingAppointments' => Appointment::where('status', '!=', 'cancelled')
                ->get(['dentist_id', 'appointment_date', 'appointment_time'])
                ->map(fn ($appointment) => [
                    'dentist_id' => $appointment->dentist_id,
                    'appointment_date' => $appointment->appointment_date->format('Y-m-d'),
                    'appointment_time' => $appointment->appointment_time,
                ]),
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
            'send_email_confirmation' => 'nullable|boolean',
        ]);

        $dentist = Dentist::with('user')->findOrFail($validated['dentist_id']);
        $reason = AppointmentAvailability::unavailableReason(
            $dentist,
            $validated['appointment_date'],
            $validated['appointment_time']
        );

        if ($reason) {
            return back()
                ->withInput()
                ->withErrors([
                    'appointment_time' => $reason,
                    'dentist_id' => $reason,
                ]);
        }

        $appointment = Appointment::create([
            ...$validated,
            'status' => 'pending',
        ]);

        // Get related models
        $patient = Patient::find($validated['patient_id']);

        // Send email to dentist
        Mail::to($dentist->user->email)->send(new AppointmentBooked($appointment, 'dentist'));

        if ($request->boolean('send_email_confirmation', true) && filled($patient->email)) {
            Mail::to($patient->email)->send(new AppointmentBooked($appointment, 'patient'));
        }

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

        return redirect('/staff/appointments')->with('success', 'Appointment booked successfully. Patient and dentist notified via email and in-app.');
    }

    public function sendReminder(Appointment $appointment)
    {
        $appointment->loadMissing(['patient', 'dentist.user']);

        if ($appointment->status === 'cancelled') {
            return back()->with('error', 'Cancelled appointments cannot receive reminders.');
        }

        SendAppointmentReminderJob::dispatchSync($appointment);
        AuditLog::log('sent_reminder', 'appointments', "Sent reminder for appointment ID: {$appointment->id}");

        return back()->with('success', 'Appointment reminder sent successfully.');
    }

    public function edit(Appointment $appointment)
    {
        $appointment->loadMissing(['patient', 'dentist.user']);

        $patients = Patient::all(['id', 'first_name', 'last_name']);
        $dentists = Dentist::with('user:id,name,active')->get(['id', 'user_id', 'specialization', 'schedule_days']);
        
        // Generate available time slots using clinic config
        $timeSlots = ClinicHelper::generateTimeSlots();

        return Inertia::render('Staff/Appointments/Edit', [
            'appointment' => $appointment,
            'patients' => $patients,
            'dentists' => $dentists,
            'timeSlots' => $timeSlots,
            'existingAppointments' => Appointment::where('status', '!=', 'cancelled')
                ->where('id', '!=', $appointment->id)
                ->get(['dentist_id', 'appointment_date', 'appointment_time'])
                ->map(fn ($existingAppointment) => [
                    'dentist_id' => $existingAppointment->dentist_id,
                    'appointment_date' => $existingAppointment->appointment_date->format('Y-m-d'),
                    'appointment_time' => $existingAppointment->appointment_time,
                ]),
        ]);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'appointment_date' => 'required|date|after:today',
            'appointment_time' => 'required|date_format:H:i',
            'type' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $appointment->loadMissing('dentist.user');

        $reason = AppointmentAvailability::unavailableReason(
            $appointment->dentist,
            $validated['appointment_date'],
            $validated['appointment_time'],
            $appointment->id
        );

        if ($reason) {
            return back()
                ->withInput()
                ->withErrors([
                    'appointment_time' => $reason,
                ]);
        }

        $appointment->update($validated);
        AuditLog::log('updated', 'appointments', "Rescheduled appointment ID: {$appointment->id}");

        return redirect('/staff/appointments')->with('success', 'Appointment updated successfully.');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->update(['status' => 'cancelled']);
        AuditLog::log('cancelled', 'appointments', "Cancelled appointment ID: {$appointment->id}");

        return redirect('/staff/appointments')->with('success', 'Appointment cancelled.');
    }

    public function exportPdf()
    {
        $appointments = Appointment::with(['patient.user', 'dentist.user'])
            ->orderBy('appointment_date', 'desc')
            ->get();

        AuditLog::log('exported', 'appointments', 'Staff exported appointments as PDF');

        $pdf = Pdf::loadView('pdf.appointments', compact('appointments'));
        return $pdf->download('appointments-' . now()->format('Y-m-d-His') . '.pdf');
    }

    public function exportExcel()
    {
        AuditLog::log('exported', 'appointments', 'Staff exported appointments as Excel');

        return Excel::download(
            new AppointmentsExport(),
            'appointments-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }
}
