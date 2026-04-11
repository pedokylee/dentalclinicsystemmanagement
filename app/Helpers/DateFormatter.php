<?php

namespace App\Helpers;

use Carbon\Carbon;

/**
 * DateFormatter - Centralized date formatting to ensure consistency across the application
 * 
 * All dates should be formatted using these methods to maintain consistent formatting
 * across the entire application (controllers, views, API responses).
 */
class DateFormatter
{
    /**
     * Format appointment date and time for display
     * Example: "Apr 12, 2026"
     */
    public static function appointmentDate(?Carbon $date): string
    {
        return $date?->format('M d, Y') ?? '—';
    }

    /**
     * Format appointment time
     * Example: "09:30 AM"
     */
    public static function appointmentTime(?string $time): string
    {
        if (!$time) {
            return '—';
        }
        
        return Carbon::createFromFormat('H:i', $time)?->format('h:i A') ?? $time;
    }

    /**
     * Format full appointment datetime for display
     * Example: "Apr 12, 2026 at 09:30 AM"
     */
    public static function appointmentDateTime(?Carbon $date, ?string $time): string
    {
        if (!$date || !$time) {
            return '—';
        }
        
        return $date->format('M d, Y') . ' at ' . Carbon::createFromFormat('H:i', $time)->format('h:i A');
    }

    /**
     * Format date for database/API responses
     * Example: "2026-04-12"
     */
    public static function databaseDate(?Carbon $date): ?string
    {
        return $date?->format('Y-m-d');
    }

    /**
     * Format date and time with time zone for timestamps
     * Example: "2026-04-12 14:30:00"
     */
    public static function timestamp(?Carbon $date): ?string
    {
        return $date?->format('Y-m-d H:i:s');
    }

    /**
     * Format date for audit logs
     * Example: "Apr 12 14:30"
     */
    public static function auditLog(?Carbon $date): string
    {
        return $date?->format('M d H:i') ?? '—';
    }

    /**
     * Format relative time (e.g., "2 days ago", "in 3 hours")
     */
    public static function relative(?Carbon $date): string
    {
        return $date?->diffForHumans() ?? '—';
    }

    /**
     * Format for medical/treatment records
     * Example: "Visit on Apr 12, 2026"
     */
    public static function visitDate(?Carbon $date): string
    {
        return 'Visit on ' . ($date?->format('M d, Y') ?? 'N/A');
    }
}
