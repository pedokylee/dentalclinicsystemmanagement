<?php

namespace App\Http\Controllers\Admin;

use App\Models\AuditLog;
use App\Exports\AuditLogsExport;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class AuditLogController extends Controller
{
    public function index()
    {
        $logs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(config('app.pagination.audit_logs'))
            ->withQueryString();

        return Inertia::render('Admin/AuditLog', ['logs' => $logs]);
    }

    public function exportPdf()
    {
        $logs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $pdf = Pdf::loadView('pdf.audit_logs', compact('logs'));
        return $pdf->download('audit-logs-' . now()->format('Y-m-d-His') . '.pdf');
    }

    public function exportExcel()
    {
        return Excel::download(
            new AuditLogsExport(),
            'audit-logs-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }
}
