<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientBookingAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_patient_roles_are_redirected_away_from_self_booking_page(): void
    {
        foreach (['admin', 'staff', 'dentist'] as $role) {
            $user = User::factory()->create([
                'role' => $role,
                'active' => true,
            ]);

            $this->actingAs($user)
                ->get(route('appointments.book'))
                ->assertRedirect(route('dashboard'));

            auth()->logout();
        }
    }

    public function test_non_patient_roles_cannot_submit_self_booking_request(): void
    {
        $user = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        $this->actingAs($user)
            ->post(route('appointments.store-public'), [
                'first_name' => 'Blocked',
                'last_name' => 'User',
                'email' => 'blocked@example.com',
                'phone' => '09170000000',
                'appointment_date' => now()->addDays(5)->toDateString(),
                'appointment_time' => '09:00',
                'dentist_id' => 1,
                'type' => 'checkup',
            ])
            ->assertRedirect(route('dashboard'));
    }
}
