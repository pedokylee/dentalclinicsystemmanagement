<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Support\ReportData;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Appointment;
use App\Models\Patient;
use App\Exports\ReportsExport;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        [$start, $end] = ReportData::resolveRange(
            $request->query('startDate'),
            $request->query('endDate')
        );
        $reportData = ReportData::build($start, $end);

        return Inertia::render('Admin/Reports', [
            ...$reportData,
            'filters' => [
                'startDate' => $start->toDateString(),
                'endDate' => $end->toDateString(),
            ],
        ]);
    }

    public function exportPdf(Request $request)
    {
        AuditLog::log('exported', 'reports', 'Admin exported reports as PDF');
        [$start, $end] = ReportData::resolveRange(
            $request->query('startDate'),
            $request->query('endDate')
        );
        $reportData = ReportData::build($start, $end);

        $pdf = Pdf::loadView('pdf.reports', [
            ...$reportData,
        ]);

        return $pdf->download('reports-' . now()->format('Y-m-d-His') . '.pdf');
    }

    public function exportExcel(Request $request)
    {
        AuditLog::log('exported', 'reports', 'Admin exported reports as Excel');
        [$start, $end] = ReportData::resolveRange(
            $request->query('startDate'),
            $request->query('endDate')
        );
        $reportData = ReportData::build($start, $end);

        return Excel::download(
            new ReportsExport(
                $reportData['appointmentsByDay'],
                $reportData['dayLabels'],
                $reportData['patientGrowth'],
                $reportData['monthLabels'],
                $reportData['procedures'],
                $reportData['procedureData'],
                $reportData['monthlySummary']
            ),
            'reports-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }
}
