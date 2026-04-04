<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ReportsExport implements FromArray, WithHeadings
{
    protected $appointmentsByDay;
    protected $dayLabels;
    protected $patientGrowth;
    protected $monthLabels;
    protected $procedures;
    protected $procedureData;
    protected $monthlySummary;

    public function __construct($appointmentsByDay, $dayLabels, $patientGrowth, $monthLabels, $procedures, $procedureData, $monthlySummary)
    {
        $this->appointmentsByDay = $appointmentsByDay;
        $this->dayLabels = $dayLabels;
        $this->patientGrowth = $patientGrowth;
        $this->monthLabels = $monthLabels;
        $this->procedures = $procedures;
        $this->procedureData = $procedureData;
        $this->monthlySummary = $monthlySummary;
    }

    public function array(): array
    {
        $data = [
            ['CLINIC REPORTS SUMMARY'],
            [],
            ['MONTHLY SUMMARY'],
            ['Metric', 'Value'],
            ['Total Appointments', $this->monthlySummary['appointments'] ?? 0],
            ['Total Patients', $this->monthlySummary['patients'] ?? 0],
            ['Monthly Revenue', '$' . ($this->monthlySummary['revenue'] ?? 0)],
            [],
            ['APPOINTMENTS BY DAY (Last 7 Days)'],
            ['Day', 'Count'],
        ];

        foreach ($this->dayLabels as $index => $label) {
            $data[] = [$label, $this->appointmentsByDay[$index] ?? 0];
        }

        $data[] = [];
        $data[] = ['PATIENT GROWTH (Last 8 Months)'];
        $data[] = ['Month', 'New Patients'];

        foreach ($this->monthLabels as $index => $label) {
            $data[] = [$label, $this->patientGrowth[$index] ?? 0];
        }

        $data[] = [];
        $data[] = ['PROCEDURE BREAKDOWN'];
        $data[] = ['Procedure', 'Count'];

        foreach ($this->procedures as $index => $procedure) {
            $data[] = [$procedure, $this->procedureData[$index] ?? 0];
        }

        return $data;
    }

    public function headings(): array
    {
        return ['Reports Data'];
    }
}
