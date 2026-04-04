<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class NotifyAppointmentConfirmedJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function handle(): void
    {
        // Notify patient that appointment is confirmed
        Notification::create([
            'user_id' => $this->appointment->patient->user_id,
            'type' => 'appointment_confirmed',
            'title' => 'Appointment Confirmed',
            'message' => "Your appointment has been confirmed for {$this->appointment->appointment_date->format('M d, Y')} at {$this->appointment->appointment_time}",
            'related_id' => $this->appointment->id,
            'read' => false,
        ]);
    }
}
