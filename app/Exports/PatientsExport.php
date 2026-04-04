<?php

namespace App\Exports;

use App\Models\Patient;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PatientsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    public function collection()
    {
        return Patient::with('user')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Full Name',
            'Email',
            'Contact Number',
            'Date of Birth',
            'Gender',
            'Address',
            'Medical Alerts',
            'Patient Status',
            'Registered Date',
        ];
    }

    public function map($patient): array
    {
        return [
            $patient->id,
            $patient->full_name ?? 'N/A',
            $patient->user?->email ?? 'N/A',
            $patient->contact_number ?? 'N/A',
            $patient->date_of_birth?->format('M d, Y') ?? 'N/A',
            ucfirst($patient->gender) ?? 'N/A',
            $patient->address ?? 'N/A',
            $patient->medical_alerts ?? 'None',
            ucfirst($patient->patient_status) ?? 'Active',
            $patient->created_at?->format('M d, Y') ?? 'N/A',
        ];
    }
}
