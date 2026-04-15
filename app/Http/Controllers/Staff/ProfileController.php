<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Concerns\InteractsWithUserSettings;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    use InteractsWithUserSettings;

    public function show()
    {
        $user = $this->loadUserSettings(auth()->user());

        return Inertia::render('Staff/Profile', [
            'user' => $user,
            'settings' => $this->settingsPayload($user),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);
        AuditLog::log('updated', 'staff_profile', 'Updated own account settings');

        return back()->with('success', 'Account settings updated successfully.');
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

        AuditLog::log('updated', 'staff_password', 'Updated own password');

        return back()->with('success', 'Password updated successfully.');
    }

    public function updatePreferences(Request $request)
    {
        $user = auth()->user();

        if (! $this->settingsAvailable()) {
            return back()->with('error', $this->settingsUnavailableMessage());
        }

        $validated = $request->validate([
            'notification_preferences.in_app_notifications' => 'required|boolean',
            'notification_preferences.email_notifications' => 'required|boolean',
            'notification_preferences.appointment_updates' => 'required|boolean',
            'notification_preferences.reminder_notifications' => 'required|boolean',
            'ui_preferences.compact_tables' => 'required|boolean',
            'ui_preferences.show_timestamps_24h' => 'required|boolean',
        ]);

        $this->persistSettings(
            $user,
            $validated['notification_preferences'],
            $validated['ui_preferences']
        );

        AuditLog::log('updated', 'staff_preferences', 'Updated own preferences');

        return back()->with('success', 'Preferences updated successfully.');
    }
}
