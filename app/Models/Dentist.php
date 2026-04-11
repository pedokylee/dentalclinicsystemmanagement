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

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            $days = is_array($model->schedule_days) ? $model->schedule_days : json_decode($model->schedule_days, true) ?? [];
            
            // Validate that all schedule days are valid
            if (!is_array($days) || empty($days)) {
                throw new \Exception('Schedule days must be a non-empty array');
            }
            
            $invalidDays = array_diff($days, $validDays);
            if (!empty($invalidDays)) {
                throw new \Exception('Invalid schedule days: ' . implode(', ', $invalidDays));
            }
        });
    }

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
