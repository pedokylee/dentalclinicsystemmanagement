<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;
use App\Support\UserSettingDefaults;
use Illuminate\Support\Facades\Schema;

trait InteractsWithUserSettings
{
    protected function settingsAvailable(): bool
    {
        return Schema::hasTable('user_settings');
    }

    protected function settingsUnavailableMessage(): string
    {
        return 'User settings are temporarily unavailable until the latest database migration is applied.';
    }

    protected function loadUserSettings(User $user): User
    {
        if ($this->settingsAvailable()) {
            $user->load('settings');
        }

        return $user;
    }

    protected function settingsPayload(User $user): array
    {
        $settings = $this->settingsAvailable() ? $user->settings : null;

        return [
            'notification_preferences' => array_merge(
                UserSettingDefaults::notificationPreferences(),
                $settings?->notification_preferences ?? []
            ),
            'ui_preferences' => array_merge(
                UserSettingDefaults::uiPreferences(),
                $settings?->ui_preferences ?? []
            ),
        ];
    }

    protected function persistSettings(User $user, array $notificationPreferences, array $uiPreferences): void
    {
        if (! $this->settingsAvailable()) {
            return;
        }

        $user->settings()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'notification_preferences' => array_merge(
                    UserSettingDefaults::notificationPreferences(),
                    $notificationPreferences
                ),
                'ui_preferences' => array_merge(
                    UserSettingDefaults::uiPreferences(),
                    $uiPreferences
                ),
            ]
        );
    }
}
