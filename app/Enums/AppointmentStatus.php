<?php

namespace App\Enums;

/**
 * AppointmentStatus - Enumeration of valid appointment statuses
 * 
 * Replaces magic strings like 'pending', 'confirmed' etc. throughout the app
 * Provides type safety and IDE autocomplete support
 * 
 * Usage:
 *   $appointment->status = AppointmentStatus::CONFIRMED->value;
 *   if ($appointment->status === AppointmentStatus::CONFIRMED->value) { ... }
 */
enum AppointmentStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case SCHEDULED = 'scheduled';
    case CANCELLED = 'cancelled';

    /**
     * Get human-readable status name
     */
    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::CONFIRMED => 'Confirmed',
            self::SCHEDULED => 'Scheduled',
            self::CANCELLED => 'Cancelled',
        };
    }

    /**
     * Get all valid status values for validation
     */
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
