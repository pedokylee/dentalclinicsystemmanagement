<?php

namespace Tests\Feature;

use App\Mail\AppointmentBooked;
use App\Models\Appointment;
use App\Models\Dentist;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class StaffAppointmentsFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_open_create_and_edit_appointment_pages(): void
    {
        [$staff, $patient, $dentist] = $this->makeBookingActors();

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'dentist_id' => $dentist->id,
            'appointment_date' => '2026-04-20',
            'appointment_time' => '09:00',
            'type' => 'checkup',
            'status' => 'pending',
        ]);

        $this->actingAs($staff)
            ->get('/staff/appointments/create')
            ->assertOk();

        $this->actingAs($staff)
            ->get("/staff/appointments/{$appointment->id}/edit")
            ->assertOk();
    }

    public function test_staff_can_book_an_appointment_and_create_notifications(): void
    {
        Mail::fake();

        [$staff, $patient, $dentist] = $this->makeBookingActors();

        $response = $this->actingAs($staff)->post('/staff/appointments', [
            'patient_id' => $patient->id,
            'dentist_id' => $dentist->id,
            'appointment_date' => '2026-04-20',
            'appointment_time' => '09:00',
            'type' => 'checkup',
            'notes' => 'Routine cleaning prep',
            'send_email_confirmation' => true,
        ]);

        $response->assertRedirect('/staff/appointments');

        $appointment = Appointment::query()->firstOrFail();

        $this->assertSame('pending', $appointment->status);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $dentist->user_id,
            'type' => 'appointment_booked',
            'related_id' => $appointment->id,
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $patient->user_id,
            'type' => 'appointment_booked',
            'related_id' => $appointment->id,
        ]);

        Mail::assertSent(AppointmentBooked::class);
    }

    public function test_staff_cannot_reschedule_into_a_taken_slot(): void
    {
        [$staff, $patient, $dentist] = $this->makeBookingActors();

        $firstAppointment = Appointment::create([
            'patient_id' => $patient->id,
            'dentist_id' => $dentist->id,
            'appointment_date' => '2026-04-20',
            'appointment_time' => '09:00',
            'type' => 'checkup',
            'status' => 'scheduled',
        ]);

        $secondAppointment = Appointment::create([
            'patient_id' => $patient->id,
            'dentist_id' => $dentist->id,
            'appointment_date' => '2026-04-20',
            'appointment_time' => '10:00',
            'type' => 'checkup',
            'status' => 'scheduled',
        ]);

        $response = $this->actingAs($staff)
            ->from("/staff/appointments/{$secondAppointment->id}/edit")
            ->put("/staff/appointments/{$secondAppointment->id}", [
                'appointment_date' => '2026-04-20',
                'appointment_time' => '09:00',
                'type' => 'checkup',
                'notes' => '',
            ]);

        $response
            ->assertRedirect("/staff/appointments/{$secondAppointment->id}/edit")
            ->assertSessionHasErrors([
                'appointment_time' => 'This dentist already has an appointment at that time.',
            ]);

        $this->assertDatabaseHas('appointments', [
            'id' => $secondAppointment->id,
            'appointment_time' => '10:00',
        ]);
    }

    public function test_staff_can_send_reminder_and_cancel_appointment(): void
    {
        [$staff, $patient, $dentist] = $this->makeBookingActors();

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'dentist_id' => $dentist->id,
            'appointment_date' => '2026-04-20',
            'appointment_time' => '11:00',
            'type' => 'checkup',
            'status' => 'confirmed',
        ]);

        $this->actingAs($staff)
            ->post("/staff/appointments/{$appointment->id}/reminder")
            ->assertRedirect();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $patient->user_id,
            'type' => 'appointment_reminder',
            'related_id' => $appointment->id,
        ]);

        $this->actingAs($staff)
            ->delete("/staff/appointments/{$appointment->id}")
            ->assertRedirect('/staff/appointments');

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'cancelled',
        ]);
    }

    private function makeBookingActors(): array
    {
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
            'first_name' => 'Paolo',
            'last_name' => 'Patient',
            'email' => 'paolo@example.com',
            'phone' => '09170000111',
            'date_of_birth' => '1991-06-15',
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

        return [$staff, $patient, $dentist];
    }
}
