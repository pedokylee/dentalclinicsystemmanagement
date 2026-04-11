<?php

namespace App\Http\Controllers\Dentist;

use App\Models\User;
use App\Models\Dentist;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        return view('dentist.profile', ['user' => $user, 'dentist' => $user->dentist]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        
        // Validate user profile fields
        $userValidated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        // Update user data
        $user->update($userValidated);

        // Validate and update dentist-specific fields if present
        if ($request->has('specialization')) {
            $dentistValidated = $request->validate([
                'specialization' => 'nullable|string|max:255',
                'schedule_days' => 'nullable|array|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            ]);

            $dentist = $user->dentist;
            if ($dentist) {
                $dentist->update($dentistValidated);
            }
        }

        return back()->with('success', 'Profile updated successfully');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        auth()->user()->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return back()->with('success', 'Password updated successfully');
    }
}
