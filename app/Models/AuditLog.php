<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'module',
        'description',
        'ip_address',
    ];

    public $timestamps = true;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log(string $action, string $module, ?string $description = null, ?int $userId = null): self
    {
        return self::create([
            'user_id' => $userId ?? auth()->id(),
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'ip_address' => request()->ip(),
        ]);
    }
}
