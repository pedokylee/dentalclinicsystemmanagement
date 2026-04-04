<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TreatmentRecord extends Model
{
    protected $fillable = [
        'patient_id',
        'dentist_id',
        'appointment_id',
        'visit_date',
        'procedures',
        'notes',
        'prescription',
        'tooth_data',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'procedures' => 'array',
        'tooth_data' => 'array',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function dentist(): BelongsTo
    {
        return $this->belongsTo(Dentist::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }
}
