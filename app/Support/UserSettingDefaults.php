<?php

namespace App\Support;

class UserSettingDefaults
{
    public static function notificationPreferences(): array
    {
        return [
            'in_app_notifications' => true,
            'email_notifications' => true,
            'appointment_updates' => true,
            'reminder_notifications' => true,
        ];
    }

    public static function uiPreferences(): array
    {
        return [
            'compact_tables' => false,
            'show_timestamps_24h' => false,
        ];
    }

    public static function all(): array
    {
        return [
            'notification_preferences' => self::notificationPreferences(),
            'ui_preferences' => self::uiPreferences(),
        ];
    }
}
