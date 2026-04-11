<?php

namespace App\Http\Controllers\Staff;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PatientController extends Controller
{
    public function create()
    {
        return Inertia::render('Staff/Patients/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'contact_number' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'street_address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'medical_alerts' => 'nullable|string',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
        ]);

        // Create user and patient in transaction to ensure data integrity
        DB::transaction(function () use ($validated) {
            $email = $validated['email'] ?? $validated['first_name'] . '.' . $validated['last_name'] . '@patient.local';
            
            // Generate temporary password for patient
            $tempPassword = 'Temp' . Str::random(8);
            
            // Create user account for patient
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $email,
                'password' => Hash::make($tempPassword),
                'role' => 'patient',
            ]);

            // Create patient record linked to user
            $patient = Patient::create([
                'user_id' => $user->id,
                ...$validated,
            ]);
            
            AuditLog::log('created', 'patients', "Registered new patient: {$patient->full_name} with user ID: {$user->id}");
        });

        return redirect('/staff/dashboard')->with('success', 'Patient registered successfully. Patient account created.');
    }
}
