<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\PatientInquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LandingInquiryTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_inquiry_creates_record_and_notifies_staff(): void
    {
        $staffOne = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        $staffTwo = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        $this->post(route('inquiries.store'), [
            'full_name' => 'New Patient Example',
            'email' => 'newpatient@example.com',
            'phone' => '09171234567',
            'preferred_date' => now()->addDays(3)->toDateString(),
            'appointment_type' => 'General Checkup',
            'concern' => 'Need an initial consultation.',
        ])->assertRedirect(route('home'));

        $this->assertDatabaseHas('patient_inquiries', [
            'full_name' => 'New Patient Example',
            'email' => 'newpatient@example.com',
            'status' => 'pending_verification',
        ]);

        $inquiry = PatientInquiry::firstOrFail();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $staffOne->id,
            'type' => 'patient_inquiry_submitted',
            'related_id' => $inquiry->id,
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $staffTwo->id,
            'type' => 'patient_inquiry_submitted',
            'related_id' => $inquiry->id,
        ]);

        $this->assertSame(2, Notification::count());
    }

    public function test_landing_page_inquiry_fails_gracefully_when_table_is_missing(): void
    {
        Schema::dropIfExists('patient_inquiries');

        $this->post(route('inquiries.store'), [
            'full_name' => 'Fallback Example',
            'email' => 'fallback@example.com',
            'phone' => '09170000000',
            'preferred_date' => now()->addDays(2)->toDateString(),
            'appointment_type' => 'Consultation',
        ])->assertRedirect(route('home'))
            ->assertSessionHas('error');
    }
}
