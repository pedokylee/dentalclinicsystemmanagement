<?php

namespace App\Observers;

use App\Models\Appointment;
use App\Jobs\SendAppointmentReminderJob;
use App\Jobs\NotifyAppointmentConfirmedJob;

class AppointmentObserver
{
    /**
     * Handle the Appointment "created" event.
     */
    public function created(Appointment $appointment): void
    {
        // Dispatch job to send reminder 24 hours before appointment
        // Use null-safe operator in case appointment_date is null
        $reminderTime = $appointment->appointment_date?->subDay()->setTime(9, 0);
        
        if ($reminderTime) {
            SendAppointmentReminderJob::dispatch($appointment)->delay($reminderTime);
        }
    }

    /**
     * Handle the Appointment "updated" event.
     */
    public function updated(Appointment $appointment): void
    {
        // If status changed to confirmed, notify patient
        if ($appointment->isDirty('status') && $appointment->status === 'confirmed') {
            NotifyAppointmentConfirmedJob::dispatch($appointment);
        }
    }

    /**
     * Handle the Appointment "deleted" event.
     */
    public function deleted(Appointment $appointment): void
    {
        // You could notify about cancellation here if needed
    }
}
