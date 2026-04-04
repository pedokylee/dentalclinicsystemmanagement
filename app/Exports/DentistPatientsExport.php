<?php

namespace App\Exports;

use App\Models\Dentist;
use App\Models\Patient;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class DentistPatientsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $dentistId;

    public function __construct($dentistId)
    {
        $this->dentistId = $dentistId;
    }

    public function collection()
    {
        return Patient::whereIn('id', function ($query) {
            $query->select('patient_id')
                ->from('appointments')
                ->where('dentist_id', $this->dentistId)
                ->distinct();
        })->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Full Name',
            'Date of Birth',
            'Gender',
            'Contact Number',
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
            $patient->full_name,
            $patient->date_of_birth?->format('M d, Y') ?? 'N/A',
            ucfirst($patient->gender) ?? 'N/A',
            $patient->contact_number ?? 'N/A',
            $patient->address ?? 'N/A',
            $patient->medical_alerts ?? 'None',
            ucfirst($patient->patient_status) ?? 'Active',
            $patient->created_at?->format('M d, Y') ?? 'N/A',
        ];
    }
}
