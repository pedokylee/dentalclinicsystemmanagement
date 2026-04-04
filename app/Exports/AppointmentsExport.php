<?php

namespace App\Exports;

use App\Models\Appointment;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class AppointmentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    public function collection()
    {
        return Appointment::with(['patient.user', 'dentist.user'])
            ->orderBy('appointment_date', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Patient Name',
            'Dentist Name',
            'Appointment Date',
            'Appointment Time',
            'Appointment Type',
            'Status',
            'Notes',
            'Created At',
        ];
    }

    public function map($appointment): array
    {
        return [
            $appointment->id,
            $appointment->patient?->user?->name ?? 'N/A',
            $appointment->dentist?->user?->name ?? 'N/A',
            $appointment->appointment_date?->format('M d, Y') ?? 'N/A',
            $appointment->appointment_time ?? 'N/A',
            $appointment->appointment_type ?? 'N/A',
            ucfirst($appointment->status),
            $appointment->notes ?? '',
            $appointment->created_at?->format('M d, Y H:i') ?? 'N/A',
        ];
    }
}
