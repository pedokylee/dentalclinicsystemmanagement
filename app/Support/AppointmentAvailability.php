<?php

namespace App\Support;

use App\Models\Appointment;
use App\Models\Dentist;
use Carbon\Carbon;

class AppointmentAvailability
{
    public static function dentistIsWorkingOn(Dentist $dentist, string $date): bool
    {
        $scheduleDays = $dentist->schedule_days;

        if (! is_array($scheduleDays) || empty($scheduleDays)) {
            return true;
        }

        $dayName = Carbon::parse($date)->format('l');

        return in_array($dayName, $scheduleDays, true);
    }

    public static function hasConflict(int $dentistId, string $date, string $time, ?int $ignoreAppointmentId = null): bool
    {
        return Appointment::query()
            ->where('dentist_id', $dentistId)
            ->whereDate('appointment_date', $date)
            ->where('appointment_time', $time)
            ->where('status', '!=', 'cancelled')
            ->when($ignoreAppointmentId, fn ($query) => $query->where('id', '!=', $ignoreAppointmentId))
            ->exists();
    }

    public static function unavailableReason(
        Dentist $dentist,
        string $date,
        ?string $time = null,
        ?int $ignoreAppointmentId = null
    ): ?string {
        if (! $dentist->user?->active) {
            return 'This dentist is currently unavailable for booking.';
        }

        if (! self::dentistIsWorkingOn($dentist, $date)) {
            return 'This dentist is not scheduled on the selected date.';
        }

        if ($time && self::hasConflict($dentist->id, $date, $time, $ignoreAppointmentId)) {
            return 'This dentist already has an appointment at that time.';
        }

        return null;
    }
}
