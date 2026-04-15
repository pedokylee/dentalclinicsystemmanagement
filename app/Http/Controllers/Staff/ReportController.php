<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Support\ReportData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        [$start, $end] = ReportData::resolveRange(
            $request->query('startDate'),
            $request->query('endDate')
        );

        $reportData = ReportData::build($start, $end);

        return Inertia::render('Staff/Reports/Index', [
            ...$reportData,
            'filters' => [
                'startDate' => $start->toDateString(),
                'endDate' => $end->toDateString(),
            ],
        ]);
    }
}
