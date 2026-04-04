<?php

namespace App\Exports;

use App\Models\TreatmentRecord;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TreatmentRecordsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    public function collection()
    {
        return TreatmentRecord::with(['patient', 'dentist.user'])
            ->orderBy('visit_date', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Patient Name',
            'Dentist Name',
            'Visit Date',
            'Procedures',
            'Prescription',
            'Notes',
            'Created At',
        ];
    }

    public function map($record): array
    {
        $procedures = is_array($record->procedures) ? implode(', ', $record->procedures) : $record->procedures;
        
        return [
            $record->id,
            $record->patient?->full_name ?? 'N/A',
            $record->dentist?->user?->name ?? 'N/A',
            $record->visit_date?->format('M d, Y') ?? 'N/A',
            $procedures ?? 'N/A',
            $record->prescription ?? '',
            $record->notes ?? '',
            $record->created_at?->format('M d, Y H:i') ?? 'N/A',
        ];
    }
}
