<?php

namespace App\Http\Controllers\Patient;

use App\Models\TreatmentRecord;
use App\Models\Patient;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\AuditLog;

class TreatmentHistoryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $patient = $user->patient;

        $records = TreatmentRecord::where('patient_id', $patient->id)
            ->with('dentist.user')
            ->orderBy('visit_date', 'desc')
            ->paginate(config('app.pagination.treatment_history'))
            ->withQueryString();

        return Inertia::render('Patient/History/Index', ['records' => $records]);
    }

    public function download($id)
    {
        $user = auth()->user();
        $patient = $user->patient;

        $record = TreatmentRecord::findOrFail($id);

        if ($record->patient_id !== $patient->id) {
            abort(403, 'Unauthorized access');
        }

        AuditLog::log('exported', 'treatment_records', "Patient exported treatment record ID: {$id}");

        $pdf = Pdf::loadView('pdf.treatment_record', compact('record'));
        return $pdf->download("treatment-record-{$record->id}.pdf");
    }
}
