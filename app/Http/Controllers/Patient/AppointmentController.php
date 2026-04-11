<?php

namespace App\Http\Controllers\Patient;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Dentist;
use App\Models\User;
use App\Models\AuditLog;
use App\Exports\PatientAppointmentsExport;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Helpers\ClinicHelper;

class AppointmentController extends Controller
{
    // Authenticated patient routes
    public function index()
    {
        $user = auth()->user();
        $patient = $user->patient;

        $appointments = Appointment::where('patient_id', $patient->id)
            ->with('dentist.user')
            ->orderBy('appointment_date', 'desc')
            ->paginate(config('app.pagination.appointments'))
            ->withQueryString();

        return Inertia::render('Patient/Appointments/Index', ['appointments' => $appointments]);
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        $user = auth()->user();
        $patient = $user->patient;

        if ($appointment->patient_id !== $patient->id) {
            abort(403, 'Unauthorized');
        }

        $appointmentDateTime = \Carbon\Carbon::createFromFormat(
            'Y-m-d H:i',
            $appointment->appointment_date->format('Y-m-d') . ' ' . $appointment->appointment_time
        );
        
        if ($appointmentDateTime <= now()) {
            abort(403, 'Cannot cancel past appointments');
        }

        $appointment->update(['status' => 'cancelled']);
        AuditLog::log('cancelled', 'appointments', "Patient cancelled own appointment");

        return back()->with('success', 'Appointment cancelled.');
    }

    // Public booking routes (no auth required)
    public function publicBook()
    {
        // Redirect to login if not authenticated
        if (!auth()->check()) {
            session(['url.intended' => route('appointments.book')]);
            return redirect('/login');
        }

        $dentists = Dentist::with('user')->get();
        
        // Generate time slots using clinic config
        $timeSlots = ClinicHelper::generateTimeSlots();

        return Inertia::render('Appointments/BookPublic', [
            'dentists' => $dentists,
            'timeSlots' => $timeSlots,
            'availableDays' => $this->getAvailableDays(),
        ]);
    }

    public function getDentists()
    {
        // Redirect to login if not authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json(Dentist::with('user')->get([
            'id',
            'user_id',
            'specialization',
        ]));
    }

    public function getAvailableTimes(Request $request)
    {
        // Redirect to login if not authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $date = $request->query('date');
        $dentistId = $request->query('dentist_id');

        if (!$date || !$dentistId) {
            return response()->json(['error' => 'Missing parameters'], 400);
        }

        // Get all appointments for this dentist on this date
        $bookedTimes = Appointment::where('dentist_id', $dentistId)
            ->whereDate('appointment_date', $date)
            ->where('status', '!=', 'cancelled')
            ->pluck('appointment_time')
            ->toArray();

        // Generate available time slots using clinic config
        $allTimeSlots = ClinicHelper::generateTimeSlots();
        $timeSlots = array_filter($allTimeSlots, function($time) use ($bookedTimes) {
            return !in_array($time, $bookedTimes);
        });

        return response()->json([
            'available_times' => $timeSlots,
            'booked_times' => $bookedTimes,
        ]);
    }

    public function storePublic(Request $request)
    {
        // Validate all incoming form data
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'appointment_date' => 'required|date|after:today',
            'appointment_time' => 'required|date_format:H:i',
            'dentist_id' => 'required|exists:dentists,id',
            'type' => 'required|in:checkup,cleaning,filling,extraction,root_canal,crown,whitening',
            'notes' => 'nullable|string|max:500',
        ]);

        // Get the authenticated user making the appointment request
        $user = auth()->user();
        
        // Try to get existing patient record in this order:
        // 1. Use the authenticated user's linked patient (if they have one)
        // 2. Search for patient by email (for return customers)
        // 3. Create new patient if none exists
        $patient = $user->patient ?? Patient::where('email', $validated['email'])->first();
        
        if (!$patient) {
            // Create new patient record linked to the authenticated user
            // This ensures the patient can later log in and view their appointments
            $patient = Patient::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'date_of_birth' => null,
                'gender' => null,
                'address' => null,
            ]);
        } else {
            // Update existing patient's phone in case it changed
            $patient->update([
                'phone' => $validated['phone'],
            ]);
        }

        // Verify the requested time slot is still available
        // Check against other confirmed/scheduled appointments to prevent double-booking
        $existingAppointment = Appointment::where('dentist_id', $validated['dentist_id'])
            ->whereDate('appointment_date', $validated['appointment_date'])
            ->where('appointment_time', $validated['appointment_time'])
            ->where('status', '!=', 'cancelled')  // Ignore cancelled appointments
            ->first();

        if ($existingAppointment) {
            // Time slot was taken by another booking, reject this request
            return back()->withErrors(['appointment_time' => 'This time slot is no longer available. Please choose another.']);
        }

        // Create the appointment record with initial status
        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'dentist_id' => $validated['dentist_id'],
            'appointment_date' => $validated['appointment_date'],
            'appointment_time' => $validated['appointment_time'],
            'type' => $validated['type'],
            'notes' => $validated['notes'] ?? '',
            'status' => 'scheduled',
            'confirmation_sent' => false,
        ]);

        // Log this appointment creation for audit trail
        AuditLog::log('created', 'appointments', "Appointment booking created by {$user->email}");

        // Redirect to confirmation page with success message
        return redirect('/appointments/confirmation/' . $appointment->id)->with('success', 'Appointment booked successfully!');
    }

    public function confirmation(Appointment $appointment)
    {
        $patient = $appointment->patient;
        
        return Inertia::render('Appointments/Confirmation', [
            'appointment' => $appointment,
            'patient' => $patient,
        ]);
    }

    private function getAvailableDays(): array
    {
        $days = [];
        $today = now();
        
        // Get next 30 days, excluding Sundays
        for ($i = 1; $i <= 30; $i++) {
            $date = $today->addDays($i);
            if ($date->format('N') != 7) { // 7 = Sunday
                $days[] = $date->format('Y-m-d');
            }
            if (count($days) >= 30) break;
        }
        
        return $days;
    }

    public function exportPdf()
    {
        $user = auth()->user();
        $patient = $user->patient;

        $appointments = Appointment::where('patient_id', $patient->id)
            ->with('dentist.user')
            ->orderBy('appointment_date', 'desc')
            ->get();

        AuditLog::log('exported', 'appointments', 'Patient exported own appointments as PDF');

        $pdf = Pdf::loadView('pdf.patient_appointments', compact('appointments'));
        return $pdf->download('my-appointments-' . now()->format('Y-m-d-His') . '.pdf');
    }

    public function exportExcel()
    {
        $user = auth()->user();
        $patient = $user->patient;

        AuditLog::log('exported', 'appointments', 'Patient exported own appointments as Excel');

        return Excel::download(
            new PatientAppointmentsExport($patient->id),
            'my-appointments-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }
}
