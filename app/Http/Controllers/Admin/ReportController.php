<?php

namespace App\Http\Controllers\Admin;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\AuditLog;
use App\Exports\ReportsExport;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index()
    {
        // Appointments by day (last 7 days)
        $appointmentsByDay = [];
        $dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $appointmentsByDay[] = Appointment::whereDate('appointment_date', $date)->count();
        }

        // Patient growth (last 8 months)
        $patientGrowth = [];
        $monthLabels = [];
        for ($i = 7; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthLabels[] = $date->format('M');
            $patientGrowth[] = Patient::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
        }

        // Procedure breakdown
        $procedures = ['Cleaning', 'Filling', 'Root Canal', 'Extraction', 'Checkup'];
        $procedureData = array_map(fn() => rand(10, 50), $procedures);

        // Monthly summary
        $monthlySummary = [
            'appointments' => Appointment::whereMonth('created_at', Carbon::now()->month)->count(),
            'patients' => Patient::count(),
            'revenue' => rand(5000, 15000),
        ];

        return Inertia::render('Admin/Reports', [
            'appointmentsByDay' => $appointmentsByDay,
            'dayLabels' => $dayLabels,
            'patientGrowth' => $patientGrowth,
            'monthLabels' => $monthLabels,
            'procedures' => $procedures,
            'procedureData' => $procedureData,
            'monthlySummary' => $monthlySummary,
        ]);
    }

    public function exportPdf()
    {
        AuditLog::log('exported', 'reports', 'Admin exported reports as PDF');

        // Appointments by day (last 7 days)
        $appointmentsByDay = [];
        $dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $appointmentsByDay[] = Appointment::whereDate('appointment_date', $date)->count();
        }

        // Patient growth (last 8 months)
        $patientGrowth = [];
        $monthLabels = [];
        for ($i = 7; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthLabels[] = $date->format('M');
            $patientGrowth[] = Patient::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
        }

        // Procedure breakdown
        $procedures = ['Cleaning', 'Filling', 'Root Canal', 'Extraction', 'Checkup'];
        $procedureData = array_map(fn() => rand(10, 50), $procedures);

        // Monthly summary
        $monthlySummary = [
            'appointments' => Appointment::whereMonth('created_at', Carbon::now()->month)->count(),
            'patients' => Patient::count(),
            'revenue' => rand(5000, 15000),
        ];

        $pdf = Pdf::loadView('pdf.reports', [
            'appointmentsByDay' => $appointmentsByDay,
            'dayLabels' => $dayLabels,
            'patientGrowth' => $patientGrowth,
            'monthLabels' => $monthLabels,
            'procedures' => $procedures,
            'procedureData' => $procedureData,
            'monthlySummary' => $monthlySummary,
        ]);

        return $pdf->download('reports-' . now()->format('Y-m-d-His') . '.pdf');
    }

    public function exportExcel()
    {
        AuditLog::log('exported', 'reports', 'Admin exported reports as Excel');

        // Appointments by day (last 7 days)
        $appointmentsByDay = [];
        $dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $appointmentsByDay[] = Appointment::whereDate('appointment_date', $date)->count();
        }

        // Patient growth (last 8 months)
        $patientGrowth = [];
        $monthLabels = [];
        for ($i = 7; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthLabels[] = $date->format('M');
            $patientGrowth[] = Patient::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
        }

        // Procedure breakdown
        $procedures = ['Cleaning', 'Filling', 'Root Canal', 'Extraction', 'Checkup'];
        $procedureData = array_map(fn() => rand(10, 50), $procedures);

        // Monthly summary
        $monthlySummary = [
            'appointments' => Appointment::whereMonth('created_at', Carbon::now()->month)->count(),
            'patients' => Patient::count(),
            'revenue' => rand(5000, 15000),
        ];

        return Excel::download(
            new ReportsExport($appointmentsByDay, $dayLabels, $patientGrowth, $monthLabels, $procedures, $procedureData, $monthlySummary),
            'reports-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }
}
