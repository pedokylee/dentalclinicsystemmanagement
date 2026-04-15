<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientInquiry extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'preferred_date',
        'appointment_type',
        'concern',
        'status',
        'source',
        'matched_user_id',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'reviewed_at' => 'datetime',
        ];
    }

    public function matchedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'matched_user_id');
    }
}
