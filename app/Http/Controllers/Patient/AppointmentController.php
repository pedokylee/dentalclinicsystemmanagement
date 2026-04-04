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
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

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
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Patient/Appointments/Index', ['appointments' => $appointments]);
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        $user = auth()->user();
        $patient = $user->patient;

        if ($appointment->patient_id !== $patient->id) {
            abort(403, 'Unauthorized.');
        }

        if ($appointment->appointment_date <= now()) {
            abort(403, 'Cannot cancel past appointments.');
        }

        $appointment->update(['status' => 'cancelled']);
        AuditLog::log('cancelled', 'appointments', "Patient cancelled own appointment");

        return back()->with('success', 'Appointment cancelled.');
    }

    // Public booking routes (no auth required)
    public function publicBook()
    {
        $dentists = Dentist::with('user')->get();
        
        // Generate time slots (9 AM to 5 PM, 30-minute intervals)
        $timeSlots = [];
        for ($hour = 9; $hour < 17; $hour++) {
            $timeSlots[] = str_pad($hour, 2, '0', STR_PAD_LEFT) . ':00';
            $timeSlots[] = str_pad($hour, 2, '0', STR_PAD_LEFT) . ':30';
        }

        return Inertia::render('Appointments/BookPublic', [
            'dentists' => $dentists,
            'timeSlots' => $timeSlots,
            'availableDays' => $this->getAvailableDays(),
        ]);
    }

    public function getDentists()
    {
        return Dentist::with('user')->get([
            'id',
            'user_id',
            'specialization',
        ]);
    }

    public function getAvailableTimes(Request $request)
    {
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

        // Generate available time slots
        $timeSlots = [];
        for ($hour = 9; $hour < 17; $hour++) {
            foreach (['00', '30'] as $minute) {
                $time = str_pad($hour, 2, '0', STR_PAD_LEFT) . ':' . $minute;
                if (!in_array($time, $bookedTimes)) {
                    $timeSlots[] = $time;
                }
            }
        }

        return response()->json([
            'available_times' => $timeSlots,
            'booked_times' => $bookedTimes,
        ]);
    }

    public function storePublic(Request $request)
    {
        // Validate input
        $validated = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'appointment_date' => 'required|date|after:today',
            'appointment_time' => 'required|regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/',
            'dentist_id' => 'required|exists:dentists,id',
            'type' => 'required|in:checkup,cleaning,filling,extraction,root_canal,crown,whitening',
            'notes' => 'nullable|string|max:500',
        ])->validate();

        // Get or create patient linked to logged-in user
        $user = auth()->user();
        $patient = Patient::where('email', $validated['email'])->first();
        
        if (!$patient) {
            $patient = Patient::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'date_of_birth' => null,
                'gender' => null,
                'address' => null,
            ]);
        } else {
            // Update patient info if provided
            $patient->update([
                'phone' => $validated['phone'],
            ]);
        }

        // Check for conflicts
        $existingAppointment = Appointment::where('dentist_id', $validated['dentist_id'])
            ->whereDate('appointment_date', $validated['appointment_date'])
            ->where('appointment_time', $validated['appointment_time'])
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingAppointment) {
            return back()->withErrors(['appointment_time' => 'This time slot is no longer available. Please choose another.']);
        }

        // Create the appointment
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

        // Log the action
        AuditLog::log('created', 'appointments', "Appointment booking created by {$user->email}");

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
