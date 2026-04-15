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
use App\Support\AppointmentAvailability;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

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

        if ($appointment->starts_at <= now()) {
            abort(403, 'Cannot cancel past appointments');
        }

        $appointment->update(['status' => 'cancelled']);
        AuditLog::log('cancelled', 'appointments', "Patient cancelled own appointment");

        return back()->with('success', 'Appointment cancelled.');
    }

    // Public booking routes (no auth required)
    public function publicBook()
    {
        $gate = $this->guardPatientBookingAccess();

        if ($gate instanceof RedirectResponse) {
            return $gate;
        }

        if (! auth()->check()) {
            session(['url.intended' => route('appointments.book')]);
            return redirect('/login');
        }

        $dentists = Dentist::with('user:id,name,active')->get(['id', 'user_id', 'specialization', 'schedule_days']);

        // Generate time slots using clinic config
        $timeSlots = ClinicHelper::generateTimeSlots();

        return Inertia::render('Appointments/BookPublic', [
            'dentists' => $dentists,
            'timeSlots' => $timeSlots,
            'availableDays' => $this->getAvailableDays(),
            'existingAppointments' => Appointment::where('status', '!=', 'cancelled')
                ->get(['dentist_id', 'appointment_date', 'appointment_time'])
                ->map(fn ($appointment) => [
                    'dentist_id' => $appointment->dentist_id,
                    'appointment_date' => $appointment->appointment_date->format('Y-m-d'),
                    'appointment_time' => $appointment->appointment_time,
                ]),
        ]);
    }

    public function getDentists()
    {
        $gate = $this->guardPatientBookingAccess();

        if ($gate instanceof Response) {
            return $gate;
        }

        if (! auth()->check()) {
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
        $gate = $this->guardPatientBookingAccess();

        if ($gate instanceof Response) {
            return $gate;
        }

        if (! auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $date = $request->query('date');
        $dentistId = $request->query('dentist_id');

        if (!$date || !$dentistId) {
            return response()->json(['error' => 'Missing parameters'], 400);
        }

        $dentist = Dentist::with('user')->find($dentistId);

        if (! $dentist) {
            return response()->json(['error' => 'Dentist not found'], 404);
        }

        $unavailableReason = AppointmentAvailability::unavailableReason($dentist, $date);

        if ($unavailableReason) {
            return response()->json([
                'available_times' => [],
                'booked_times' => [],
                'unavailable_reason' => $unavailableReason,
            ]);
        }

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
            'unavailable_reason' => null,
        ]);
    }

    public function storePublic(Request $request)
    {
        $gate = $this->guardPatientBookingAccess();

        if ($gate instanceof RedirectResponse) {
            return $gate;
        }

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

        $dentist = Dentist::with('user')->findOrFail($validated['dentist_id']);
        $reason = AppointmentAvailability::unavailableReason(
            $dentist,
            $validated['appointment_date'],
            $validated['appointment_time']
        );

        if ($reason) {
            return back()->withErrors([
                'appointment_time' => $reason,
                'dentist_id' => $reason,
            ]);
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
        $gate = $this->guardPatientBookingAccess();

        if ($gate instanceof RedirectResponse) {
            return $gate;
        }

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

    private function guardPatientBookingAccess(): RedirectResponse|Response|null
    {
        $user = auth()->user();

        if (! $user) {
            return null;
        }

        if ($user->role === 'patient') {
            return null;
        }

        if (request()->expectsJson()) {
            return response()->json([
                'error' => 'Only patient accounts can access the self-booking flow.',
                'redirect' => route('dashboard'),
            ], 403);
        }

        return redirect()
            ->route('dashboard')
            ->with('error', 'Only patient accounts can use the self-booking page. You were returned to your dashboard.');
    }
}
