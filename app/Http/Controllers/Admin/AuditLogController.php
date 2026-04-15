<?php

namespace App\Http\Controllers\Admin;

use App\Models\AuditLog;
use App\Exports\AuditLogsExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logsQuery = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->when($request->filled('user'), function ($query) use ($request) {
                $query->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('name', 'like', '%' . $request->string('user')->trim() . '%');
                });
            })
            ->when($request->filled('module'), function ($query) use ($request) {
                $query->where('module', 'like', '%' . $request->string('module')->trim() . '%');
            })
            ->when($request->filled('startDate'), function ($query) use ($request) {
                $query->whereDate('created_at', '>=', $request->string('startDate')->toString());
            })
            ->when($request->filled('endDate'), function ($query) use ($request) {
                $query->whereDate('created_at', '<=', $request->string('endDate')->toString());
            });

        $logs = $logsQuery
            ->paginate(config('app.pagination.audit_logs'))
            ->withQueryString();

        return Inertia::render('Admin/AuditLog', [
            'logs' => $logs,
            'filters' => $request->only(['user', 'module', 'startDate', 'endDate']),
        ]);
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
