<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendAppointmentReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function handle(): void
    {
        // Send reminder notification to patient
        Notification::create([
            'user_id' => $this->appointment->patient->user_id,
            'type' => 'appointment_reminder',
            'title' => 'Appointment Reminder',
            'message' => "Your appointment with {$this->appointment->dentist->user->name} is scheduled for {$this->appointment->appointment_date->format('M d, Y')} at {$this->appointment->appointment_time}",
            'related_id' => $this->appointment->id,
            'read' => false,
        ]);

        // You could also send email here if you want
        // \Mail::send(...);
    }
}
