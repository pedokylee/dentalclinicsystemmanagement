<?php

namespace App\Helpers;

use Carbon\Carbon;
use Throwable;

class DateFormatter
{
    private static function formatTimeValue(?string $time): ?string
    {
        if (!$time) {
            return null;
        }

        try {
            return Carbon::parse($time)->format('h:i A');
        } catch (Throwable) {
            return $time;
        }
    }

    public static function appointmentDate(?Carbon $date): string
    {
        return $date?->format('M d, Y') ?? 'N/A';
    }

    public static function appointmentTime(?string $time): string
    {
        return self::formatTimeValue($time) ?? 'N/A';
    }

    public static function appointmentDateTime(?Carbon $date, ?string $time): string
    {
        $formattedTime = self::formatTimeValue($time);

        if (!$date || !$formattedTime) {
            return 'N/A';
        }

        return $date->format('M d, Y') . ' at ' . $formattedTime;
    }

    public static function databaseDate(?Carbon $date): ?string
    {
        return $date?->format('Y-m-d');
    }

    public static function timestamp(?Carbon $date): ?string
    {
        return $date?->format('Y-m-d H:i:s');
    }

    public static function auditLog(?Carbon $date): string
    {
        return $date?->format('M d H:i') ?? 'N/A';
    }

    public static function relative(?Carbon $date): string
    {
        return $date?->diffForHumans() ?? 'N/A';
    }

    public static function visitDate(?Carbon $date): string
    {
        return 'Visit on ' . ($date?->format('M d, Y') ?? 'N/A');
    }
}
