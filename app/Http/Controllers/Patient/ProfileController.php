<?php

namespace App\Http\Controllers\Patient;

use App\Models\Patient;
use App\Models\ProfileChangeRequest;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $patient = Patient::where('user_id', $user->id)->first();

        if (!$patient) {
            abort(404, 'Patient profile not found.');
        }

        $pendingRequests = ProfileChangeRequest::where('patient_id', $patient->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Patient/Profile', [
            'user' => $user,
            'patient' => $patient,
            'pendingRequests' => $pendingRequests,
        ]);
    }

    // Update non-sensitive fields directly
    public function update(Request $request)
    {
        $user = auth()->user();
        $patient = Patient::where('user_id', $user->id)->first();

        if (!$patient) {
            abort(404, 'Patient profile not found.');
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
        ]);

        $patient->update($validated);
        AuditLog::log('updated', 'patient_profile', "Updated own profile");

        return back()->with('success', 'Profile updated successfully.');
    }

    // Request changes to sensitive fields (needs admin approval)
    public function requestChange(Request $request)
    {
        $user = auth()->user();
        $patient = Patient::where('user_id', $user->id)->first();

        if (!$patient) {
            abort(404, 'Patient profile not found.');
        }

        $field = $request->input('field');
        $value = $request->input('value');

        // Check if field requires approval
        if (!in_array($field, ['email', 'phone', 'medical_alerts'])) {
            return back()->with('error', 'This field cannot be changed through requests.');
        }

        // Validate based on field type
        if ($field === 'email') {
            $this->validate($request, ['value' => 'required|email|unique:patients,email']);
        } elseif ($field === 'phone') {
            $this->validate($request, ['value' => 'required|string']);
        }

        // Create change request
        ProfileChangeRequest::create([
            'patient_id' => $patient->id,
            'requested_changes' => json_encode([$field => $value]),
            'status' => 'pending',
        ]);

        AuditLog::log('created', 'profile_change_request', "Requested change for field: {$field}");

        return back()->with('success', 'Change request submitted. Please wait for clinic approval.');
    }

    // Update password
    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (!password_verify($validated['current_password'], $user->password)) {
            return back()->with('error', 'Current password is incorrect.');
        }

        $user->update([
            'password' => bcrypt($validated['new_password']),
        ]);

        AuditLog::log('updated', 'patient_password', 'Updated own password');

        return back()->with('success', 'Password updated successfully.');
    }
}
