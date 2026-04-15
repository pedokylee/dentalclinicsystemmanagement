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
use Illuminate\Validation\ValidationException;

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

        [$patient, $createdNewAccount] = DB::transaction(function () use ($validated) {
            $email = filled($validated['email'] ?? null)
                ? Str::lower($validated['email'])
                : Str::uuid() . '@patient.local';

            $existingUser = User::where('email', $email)->first();

            if ($existingUser && $existingUser->role !== 'patient') {
                throw ValidationException::withMessages([
                    'email' => 'This email is already assigned to another clinic account.',
                ]);
            }

            $user = $existingUser;
            $createdNewAccount = false;

            if (! $user) {
                $createdNewAccount = true;
                $tempPassword = 'Temp' . Str::random(8);

                $user = User::create([
                    'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                    'email' => $email,
                    'password' => Hash::make($tempPassword),
                    'role' => 'patient',
                    'active' => true,
                ]);
            } else {
                $user->update([
                    'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                    'active' => true,
                ]);
            }

            $patient = Patient::query()
                ->where('user_id', $user->id)
                ->when(filled($validated['email'] ?? null), fn ($query) => $query->orWhere('email', $email))
                ->first();

            $patientData = [
                ...$validated,
                'user_id' => $user->id,
                'email' => $email,
            ];

            if ($patient) {
                $patient->update($patientData);
                AuditLog::log('updated', 'patients', "Updated existing patient: {$patient->full_name} with user ID: {$user->id}");
            } else {
                $patient = Patient::create($patientData);
                AuditLog::log('created', 'patients', "Registered new patient: {$patient->full_name} with user ID: {$user->id}");
            }

            return [$patient, $createdNewAccount];
        });

        $message = $createdNewAccount
            ? 'Patient registered successfully. Patient account created.'
            : 'Existing patient account found. Patient details were updated successfully.';

        return redirect('/staff/dashboard')->with('success', $message);
    }
}
