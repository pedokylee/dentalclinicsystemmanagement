<?php

namespace App\Http\Controllers\Staff;

use App\Models\Patient;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AuditLog;

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
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
            'medical_alerts' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
        ]);

        $patient = Patient::create($validated);
        AuditLog::log('created', 'patients', "Registered new patient: {$patient->full_name}");

        return redirect('/staff/appointments')->with('success', 'Patient registered successfully.');
    }
}
