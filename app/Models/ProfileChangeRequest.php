<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileChangeRequest extends Model
{
    protected $fillable = [
        'patient_id',
        'requested_changes',
        'status',
        'rejection_reason',
    ];

    protected $casts = [
        'requested_changes' => 'json',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}

