<?php

namespace App\Exports;

use App\Models\AuditLog;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class AuditLogsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    public function collection()
    {
        return AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'User',
            'Action',
            'Module',
            'Description',
            'Created At',
        ];
    }

    public function map($log): array
    {
        return [
            $log->id,
            $log->user?->name ?? 'System',
            ucfirst($log->action),
            $log->module,
            $log->description,
            $log->created_at?->format('M d, Y H:i') ?? 'N/A',
        ];
    }
}
