<?php

namespace App\Support;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\TreatmentRecord;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class ReportData
{
    public static function resolveRange(?string $startDate, ?string $endDate): array
    {
        $end = $endDate ? Carbon::parse($endDate)->endOfDay() : now()->endOfDay();
        $start = $startDate ? Carbon::parse($startDate)->startOfDay() : $end->copy()->subDays(29)->startOfDay();

        if ($start->greaterThan($end)) {
            [$start, $end] = [$end->copy()->startOfDay(), $start->copy()->endOfDay()];
        }

        return [$start, $end];
    }

    public static function build(Carbon $start, Carbon $end): array
    {
        $appointments = Appointment::with(['patient', 'dentist.user'])
            ->whereBetween('appointment_date', [$start->toDateString(), $end->toDateString()])
            ->get();

        $patients = Patient::whereBetween('created_at', [$start, $end])->get();
        $treatmentRecords = TreatmentRecord::whereBetween('visit_date', [$start->toDateString(), $end->toDateString()])->get();

        $period = CarbonPeriod::create($start->copy()->startOfDay(), $end->copy()->startOfDay());
        $dayLabels = [];
        $appointmentsByDay = [];
        $dailySummary = [];

        foreach ($period as $date) {
            $matches = $appointments->filter(
                fn (Appointment $appointment) => $appointment->appointment_date->isSameDay($date)
            );

            $dayLabels[] = $date->format('M d');
            $appointmentsByDay[] = $matches->count();
            $dailySummary[] = [
                'date' => $date->format('M d, Y'),
                'total' => $matches->count(),
                'completed' => $matches->where('status', 'confirmed')->count(),
                'cancelled' => $matches->where('status', 'cancelled')->count(),
                'revenue' => $matches->count() * 1500,
            ];
        }

        $months = collect();
        $cursor = $start->copy()->startOfMonth();
        while ($cursor->lessThanOrEqualTo($end)) {
            $months->push($cursor->copy());
            $cursor->addMonth();
        }

        $monthLabels = $months->map(fn (Carbon $month) => $month->format('M Y'))->all();
        $patientGrowth = $months->map(
            fn (Carbon $month) => $patients->filter(
                fn (Patient $patient) => $patient->created_at && $patient->created_at->format('Y-m') === $month->format('Y-m')
            )->count()
        )->all();

        $procedureCounts = [];
        foreach ($treatmentRecords as $record) {
            foreach (($record->procedures ?? []) as $procedure) {
                $key = str($procedure)->headline()->toString();
                $procedureCounts[$key] = ($procedureCounts[$key] ?? 0) + 1;
            }
        }

        if (empty($procedureCounts)) {
            foreach ($appointments as $appointment) {
                $key = str($appointment->type)->headline()->toString();
                $procedureCounts[$key] = ($procedureCounts[$key] ?? 0) + 1;
            }
        }

        $sortedProcedures = collect($procedureCounts)->sortDesc();

        return [
            'appointmentsByDay' => $appointmentsByDay,
            'dayLabels' => $dayLabels,
            'patientGrowth' => $patientGrowth,
            'monthLabels' => $monthLabels,
            'procedures' => $sortedProcedures->keys()->values()->all(),
            'procedureData' => $sortedProcedures->values()->all(),
            'monthlySummary' => [
                'appointments' => $appointments->count(),
                'patients' => $patients->count(),
                'procedures' => $treatmentRecords->count(),
                'revenue' => $appointments->count() * 1500,
            ],
            'dailySummary' => $dailySummary,
            'appointmentsTable' => $appointments
                ->sortByDesc(fn (Appointment $appointment) => $appointment->starts_at)
                ->values()
                ->map(fn (Appointment $appointment) => [
                    'id' => $appointment->id,
                    'date' => $appointment->appointment_date->format('M d, Y'),
                    'time' => $appointment->appointment_time,
                    'patient' => $appointment->patient?->full_name ?? 'Unknown',
                    'dentist' => $appointment->dentist?->user?->name ?? 'Unknown',
                    'type' => str($appointment->type)->headline()->toString(),
                    'status' => $appointment->status,
                ])
                ->all(),
        ];
    }
}
