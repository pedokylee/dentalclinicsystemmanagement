<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Patient extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'contact_number',
        'address',
        'medical_alerts',
        'emergency_contact',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    // Append accessors to JSON responses
    protected $appends = ['full_name', 'age'];

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

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAgeAttribute(): int
    {
        return $this->date_of_birth?->age ?? 0;
    }

    /**
     * Get the model's attributes as an array for JSON serialization
     */
    public function toArray(): array
    {
        $attributes = parent::toArray();
        
        // Ensure all necessary attributes are included
        $attributes['full_name'] = $this->full_name;
        $attributes['age'] = $this->age;
        
        return $attributes;
    }
}
