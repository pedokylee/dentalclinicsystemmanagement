<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dentist extends Model
{
    protected $fillable = [
        'user_id',
        'specialization',
        'schedule_days',
    ];

    protected $casts = [
        'schedule_days' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function treatmentRecords(): HasMany
    {
        return $this->hasMany(TreatmentRecord::class);
    }
}
