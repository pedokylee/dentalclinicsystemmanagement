<?php

namespace App\Support;

use App\Models\SystemSetting;

class SystemSettings
{
    public static function all(): array
    {
        $defaults = self::defaults();
        $stored = SystemSetting::query()
            ->get()
            ->mapWithKeys(fn (SystemSetting $setting) => [$setting->key => $setting->value])
            ->all();

        return array_replace_recursive($defaults, $stored);
    }

    public static function defaults(): array
    {
        return [
            'clinic' => [
                'name' => 'SmileCare Dental Clinic',
                'phone' => '+63 2 8123 4567',
                'email' => 'hello@smilecare.test',
                'address' => '123 Dental Avenue, Quezon City',
                'operatingHours' => 'Mon-Fri: 9:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM',
            ],
            'notifications' => [
                'emailNotifications' => true,
                'appointmentConfirmations' => true,
                'dailySummaryReport' => false,
            ],
            'permissions' => [
                'dentist' => [
                    'viewPatients' => true,
                    'editPatients' => true,
                    'bookAppts' => false,
                    'viewReports' => false,
                    'exportData' => true,
                    'manageUsers' => false,
                    'systemConfig' => false,
                ],
                'staff' => [
                    'viewPatients' => true,
                    'editPatients' => true,
                    'bookAppts' => true,
                    'viewReports' => true,
                    'exportData' => false,
                    'manageUsers' => false,
                    'systemConfig' => false,
                ],
                'patient' => [
                    'viewPatients' => false,
                    'editPatients' => false,
                    'bookAppts' => false,
                    'viewReports' => false,
                    'exportData' => true,
                    'manageUsers' => false,
                    'systemConfig' => false,
                ],
            ],
        ];
    }

    public static function putMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::all()[$key] ?? $default;
    }
}
