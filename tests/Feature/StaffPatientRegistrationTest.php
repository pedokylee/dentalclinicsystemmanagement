<?php

namespace Tests\Feature;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffPatientRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_reuses_existing_patient_account_instead_of_crashing_on_duplicate_email(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        $patientUser = User::factory()->create([
            'name' => 'Jemuel Abella',
            'email' => 'jemuelabella5@gmail.com',
            'role' => 'patient',
            'active' => true,
        ]);

        $patient = Patient::create([
            'user_id' => $patientUser->id,
            'first_name' => 'Jemuel',
            'last_name' => 'Abella',
            'email' => 'jemuelabella5@gmail.com',
            'phone' => '09000000000',
            'date_of_birth' => '1999-01-01',
            'gender' => 'male',
        ]);

        $response = $this->actingAs($staff)->post('/staff/patients', [
            'first_name' => 'Jemuel',
            'last_name' => 'Abella',
            'date_of_birth' => '2026-04-01',
            'gender' => 'female',
            'contact_number' => '09074297609',
            'email' => 'jemuelabella5@gmail.com',
            'street_address' => 'Yosoya st., Potohan',
            'city' => 'Tubigon',
            'state' => null,
            'zip_code' => '6329',
            'medical_alerts' => 'SFMLKMSKLMCKLKASL',
            'emergency_contact_name' => null,
            'emergency_contact_phone' => null,
        ]);

        $response->assertRedirect('/staff/dashboard');

        $this->assertSame(1, User::where('email', 'jemuelabella5@gmail.com')->count());
        $this->assertSame(1, Patient::where('email', 'jemuelabella5@gmail.com')->count());

        $patient->refresh();

        $this->assertSame('female', $patient->gender);
        $this->assertSame('09074297609', $patient->contact_number);
        $this->assertSame('Tubigon', $patient->city);
    }

    public function test_staff_gets_validation_error_when_email_belongs_to_non_patient_account(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        User::factory()->create([
            'email' => 'existing-admin@example.com',
            'role' => 'admin',
            'active' => true,
        ]);

        $response = $this->actingAs($staff)
            ->from('/staff/patients/create')
            ->post('/staff/patients', [
                'first_name' => 'Existing',
                'last_name' => 'Admin',
                'date_of_birth' => '2000-01-01',
                'gender' => 'male',
                'contact_number' => '09170000000',
                'email' => 'existing-admin@example.com',
            ]);

        $response
            ->assertRedirect('/staff/patients/create')
            ->assertSessionHasErrors([
                'email' => 'This email is already assigned to another clinic account.',
            ]);
    }
}
