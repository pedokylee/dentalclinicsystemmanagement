<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Dentist;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AppointmentAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_available_times_returns_unavailable_message_when_dentist_is_off_schedule(): void
    {
        $patientUser = User::factory()->create([
            'role' => 'patient',
            'active' => true,
        ]);

        Patient::create([
            'user_id' => $patientUser->id,
            'first_name' => 'Paula',
            'last_name' => 'Patient',
            'email' => 'paula@example.com',
            'phone' => '09170000001',
            'date_of_birth' => '1995-01-01',
            'gender' => 'female',
        ]);

        $dentistUser = User::factory()->create([
            'role' => 'dentist',
            'active' => true,
        ]);

        $dentist = Dentist::create([
            'user_id' => $dentistUser->id,
            'specialization' => 'Orthodontics',
            'schedule_days' => ['Monday', 'Wednesday'],
        ]);

        $response = $this->actingAs($patientUser)->getJson(route('appointments.times', [
            'date' => '2026-04-21',
            'dentist_id' => $dentist->id,
        ]));

        $response
            ->assertOk()
            ->assertJson([
                'available_times' => [],
                'unavailable_reason' => 'This dentist is not scheduled on the selected date.',
            ]);
    }

    public function test_staff_cannot_book_an_already_taken_slot(): void
    {
        Mail::fake();

        $staff = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        $patientUser = User::factory()->create([
            'role' => 'patient',
            'active' => true,
        ]);

        $patient = Patient::create([
            'user_id' => $patientUser->id,
            'first_name' => 'Peter',
            'last_name' => 'Patient',
            'email' => 'peter@example.com',
            'phone' => '09170000002',
            'date_of_birth' => '1992-05-01',
            'gender' => 'male',
        ]);

        $dentistUser = User::factory()->create([
            'role' => 'dentist',
            'active' => true,
        ]);

        $dentist = Dentist::create([
            'user_id' => $dentistUser->id,
            'specialization' => 'General Dentistry',
            'schedule_days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        ]);

        Appointment::create([
            'patient_id' => $patient->id,
            'dentist_id' => $dentist->id,
            'appointment_date' => '2026-04-20',
            'appointment_time' => '09:00',
            'type' => 'checkup',
            'status' => 'scheduled',
        ]);

        $response = $this->actingAs($staff)->from('/staff/appointments/create')->post('/staff/appointments', [
            'patient_id' => $patient->id,
            'dentist_id' => $dentist->id,
            'appointment_date' => '2026-04-20',
            'appointment_time' => '09:00',
            'type' => 'checkup',
            'notes' => 'Duplicate booking attempt',
            'send_email_confirmation' => true,
        ]);

        $response
            ->assertRedirect('/staff/appointments/create')
            ->assertSessionHasErrors([
                'appointment_time' => 'This dentist already has an appointment at that time.',
            ]);
    }
}
