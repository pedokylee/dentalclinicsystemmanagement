<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class TreatmentRecordAttachment extends Model
{
    protected $fillable = [
        'treatment_record_id',
        'type',
        'file_path',
        'original_name',
        'mime_type',
        'size',
    ];

    protected $appends = [
        'download_url',
    ];

    public function treatmentRecord(): BelongsTo
    {
        return $this->belongsTo(TreatmentRecord::class);
    }

    public function getDownloadUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->file_path);
    }
}
