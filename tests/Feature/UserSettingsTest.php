<?php

namespace Tests\Feature;

use App\Models\Dentist;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_each_role_can_open_its_settings_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'active' => true]);
        $staff = User::factory()->create(['role' => 'staff', 'active' => true]);
        $dentistUser = User::factory()->create(['role' => 'dentist', 'active' => true]);
        $patientUser = User::factory()->create(['role' => 'patient', 'active' => true]);

        Dentist::create([
            'user_id' => $dentistUser->id,
            'specialization' => 'General Dentistry',
            'schedule_days' => ['Monday', 'Tuesday'],
        ]);

        Patient::create([
            'user_id' => $patientUser->id,
            'first_name' => 'Pat',
            'last_name' => 'Ient',
            'email' => 'patient@example.com',
            'phone' => '09170000010',
            'date_of_birth' => '1990-01-01',
            'gender' => 'other',
        ]);

        $this->actingAs($admin)->get(route('admin.profile'))->assertOk();
        auth()->logout();

        $this->actingAs($staff)->get(route('staff.profile'))->assertOk();
        auth()->logout();

        $this->actingAs($dentistUser)->get(route('dentist.profile'))->assertOk();
        auth()->logout();

        $this->actingAs($patientUser)->get(route('patient.profile'))->assertOk();
    }

    public function test_admin_and_staff_can_update_preferences(): void
    {
        foreach (['admin', 'staff'] as $role) {
            $user = User::factory()->create([
                'role' => $role,
                'active' => true,
            ]);

            $this->actingAs($user)
                ->patch(route("{$role}.profile.preferences"), [
                    'notification_preferences' => [
                        'in_app_notifications' => true,
                        'email_notifications' => false,
                        'appointment_updates' => true,
                        'reminder_notifications' => false,
                    ],
                    'ui_preferences' => [
                        'compact_tables' => true,
                        'show_timestamps_24h' => true,
                    ],
                ])
                ->assertRedirect();

            $this->assertDatabaseHas('user_settings', [
                'user_id' => $user->id,
            ]);

            auth()->logout();
        }
    }

    public function test_dentist_can_update_schedule_and_preferences(): void
    {
        $user = User::factory()->create([
            'role' => 'dentist',
            'active' => true,
        ]);

        $dentist = Dentist::create([
            'user_id' => $user->id,
            'specialization' => 'General Dentistry',
            'schedule_days' => ['Monday', 'Tuesday'],
        ]);

        $this->actingAs($user)
            ->patch(route('dentist.profile.update'), [
                'name' => 'Dr Updated',
                'email' => $user->email,
                'specialization' => 'Orthodontics',
                'schedule_days' => ['Wednesday', 'Thursday'],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('dentists', [
            'id' => $dentist->id,
            'specialization' => 'Orthodontics',
        ]);

        $this->actingAs($user)
            ->patch(route('dentist.profile.preferences'), [
                'notification_preferences' => [
                    'in_app_notifications' => true,
                    'email_notifications' => true,
                    'appointment_updates' => true,
                    'reminder_notifications' => true,
                ],
                'ui_preferences' => [
                    'compact_tables' => false,
                    'show_timestamps_24h' => true,
                ],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('user_settings', [
            'user_id' => $user->id,
        ]);
    }

    public function test_patient_can_update_preferences(): void
    {
        $user = User::factory()->create([
            'role' => 'patient',
            'active' => true,
        ]);

        Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Pat',
            'last_name' => 'Ient',
            'email' => 'patient@example.com',
            'phone' => '09170000011',
            'date_of_birth' => '1990-01-01',
            'gender' => 'other',
        ]);

        $this->actingAs($user)
            ->patch(route('patient.profile.preferences'), [
                'notification_preferences' => [
                    'in_app_notifications' => true,
                    'email_notifications' => false,
                    'appointment_updates' => true,
                    'reminder_notifications' => true,
                ],
                'ui_preferences' => [
                    'compact_tables' => true,
                    'show_timestamps_24h' => false,
                ],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('user_settings', [
            'user_id' => $user->id,
        ]);
    }
}
