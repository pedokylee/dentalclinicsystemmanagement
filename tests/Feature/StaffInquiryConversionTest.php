<?php

namespace Tests\Feature;

use App\Models\PatientInquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class StaffInquiryConversionTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_convert_inquiry_into_patient_record(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        $inquiry = PatientInquiry::create([
            'full_name' => 'Jamie Dela Cruz',
            'email' => 'jamie@example.com',
            'phone' => '09175550000',
            'appointment_type' => 'Consultation',
            'status' => 'pending_verification',
            'source' => 'landing_page',
        ]);

        $response = $this->actingAs($staff)->post(route('staff.inquiries.store-conversion', $inquiry), [
            'first_name' => 'Jamie',
            'last_name' => 'Dela Cruz',
            'email' => 'jamie@example.com',
            'date_of_birth' => '1998-02-14',
            'gender' => 'female',
            'contact_number' => '09175550000',
            'street_address' => '123 Sample Street',
            'city' => 'Quezon City',
            'state' => 'Metro Manila',
            'zip_code' => '1100',
            'medical_alerts' => 'NKA',
            'emergency_contact_name' => 'Mia Cruz',
            'emergency_contact_phone' => '09179999999',
            'temporary_password' => 'TempPass123',
            'temporary_password_confirmation' => 'TempPass123',
        ]);

        $response->assertRedirect(route('staff.inquiries.index', ['status' => 'converted']));

        $this->assertDatabaseHas('users', [
            'email' => 'jamie@example.com',
            'role' => 'patient',
        ]);

        $this->assertDatabaseHas('patients', [
            'email' => 'jamie@example.com',
            'first_name' => 'Jamie',
            'last_name' => 'Dela Cruz',
            'contact_number' => '09175550000',
        ]);

        $this->assertDatabaseHas('patient_inquiries', [
            'id' => $inquiry->id,
            'status' => 'converted',
        ]);
    }

    public function test_staff_inquiry_index_redirects_gracefully_when_table_is_missing(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        Schema::dropIfExists('patient_inquiries');

        $this->actingAs($staff)
            ->get(route('staff.inquiries.index'))
            ->assertRedirect(route('staff.dashboard'))
            ->assertSessionHas('error');
    }
}
