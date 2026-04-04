<?php

namespace App\Exports;

use App\Models\Patient;
use App\Models\Appointment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PatientAppointmentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $patientId;

    public function __construct($patientId)
    {
        $this->patientId = $patientId;
    }

    public function collection()
    {
        return Appointment::where('patient_id', $this->patientId)
            ->with(['dentist.user'])
            ->orderBy('appointment_date', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Dentist',
            'Appointment Date',
            'Appointment Time',
            'Type',
            'Status',
            'Notes',
            'Created At',
        ];
    }

    public function map($appointment): array
    {
        return [
            $appointment->id,
            'Dr. ' . ($appointment->dentist?->user?->name ?? 'N/A'),
            $appointment->appointment_date?->format('M d, Y') ?? 'N/A',
            $appointment->appointment_time ?? 'N/A',
            $appointment->appointment_type ?? 'N/A',
            ucfirst($appointment->status),
            $appointment->notes ?? '',
            $appointment->created_at?->format('M d, Y H:i') ?? 'N/A',
        ];
    }
}
