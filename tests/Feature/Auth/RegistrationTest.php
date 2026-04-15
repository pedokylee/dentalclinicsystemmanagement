<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_registration_preserves_booking_intent_and_assigns_patient_role(): void
    {
        $this->withSession([
            'url.intended' => route('appointments.book'),
        ]);

        $response = $this->post('/register', [
            'name' => 'Booking Patient',
            'email' => 'booking@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('appointments.book'));

        $this->assertDatabaseHas('users', [
            'email' => 'booking@example.com',
            'role' => 'patient',
        ]);
    }
}
