<?php

namespace Tests\Unit;

use App\Helpers\DateFormatter;
use App\Models\Appointment;
use Tests\TestCase;

class AppointmentFormattingTest extends TestCase
{
    public function test_appointment_starts_at_handles_times_with_seconds(): void
    {
        $appointment = new Appointment([
            'appointment_date' => '2026-04-15',
            'appointment_time' => '09:30:00',
        ]);

        $this->assertSame('2026-04-15 09:30:00', $appointment->starts_at->format('Y-m-d H:i:s'));
    }

    public function test_date_formatter_handles_times_with_seconds(): void
    {
        $this->assertSame('09:30 AM', DateFormatter::appointmentTime('09:30:00'));
    }
}
