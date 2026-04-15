<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Support\SystemSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemConfigController extends Controller
{
    public function index()
    {
        $settings = SystemSettings::all();

        return Inertia::render('Admin/Config', [
            'settings' => $settings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'clinic' => 'required|array',
            'clinic.name' => 'required|string|max:255',
            'clinic.phone' => 'nullable|string|max:50',
            'clinic.email' => 'nullable|email|max:255',
            'clinic.address' => 'nullable|string|max:500',
            'clinic.operatingHours' => 'nullable|string|max:255',
            'notifications' => 'required|array',
            'notifications.emailNotifications' => 'boolean',
            'notifications.appointmentConfirmations' => 'boolean',
            'notifications.dailySummaryReport' => 'boolean',
            'permissions' => 'required|array',
        ]);

        SystemSettings::putMany([
            'clinic' => $validated['clinic'],
            'notifications' => $validated['notifications'],
            'permissions' => $validated['permissions'],
        ]);

        AuditLog::log('updated', 'system_settings', 'Updated clinic system configuration');

        return redirect()->route('admin.config')->with('success', 'Configuration saved successfully.');
    }
}
