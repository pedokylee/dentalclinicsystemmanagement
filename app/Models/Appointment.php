<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Throwable;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'dentist_id',
        'appointment_date',
        'appointment_time',
        'type',
        'status',
        'notes',
        'confirmation_sent',
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function dentist(): BelongsTo
    {
        return $this->belongsTo(Dentist::class);
    }

    public function getAppointmentTimeAttribute($value): string
    {
        $time = trim((string) $value);

        if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $time) === 1) {
            return Str::substr($time, 0, 5);
        }

        return $time;
    }

    public function getStartsAtAttribute(): Carbon
    {
        $date = $this->appointment_date instanceof Carbon
            ? $this->appointment_date->format('Y-m-d')
            : Carbon::parse($this->appointment_date)->format('Y-m-d');

        $time = trim((string) $this->appointment_time);

        try {
            return Carbon::parse("{$date} {$time}");
        } catch (Throwable) {
            return Carbon::parse($date)->startOfDay();
        }
    }
}
