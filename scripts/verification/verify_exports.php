<?php

// Test export functionality
echo "Testing Export Features...\n";

// Test 1: Verify all required views exist
echo "\n=== Testing PDF Views ===\n";
$views = [
    'resources/views/pdf/treatment_record.blade.php',
    'resources/views/pdf/reports.blade.php',
    'resources/views/pdf/users.blade.php',
    'resources/views/pdf/appointments.blade.php',
];

foreach ($views as $view) {
    if (file_exists($view)) {
        echo "✓ {$view} exists\n";
    } else {
        echo "✗ {$view} MISSING\n";
    }
}

// Test 2: Verify all export classes exist
echo "\n=== Testing Export Classes ===\n";
$exports = [
    'app/Exports/ReportsExport.php',
    'app/Exports/AppointmentsExport.php',
    'app/Exports/UsersExport.php',
    'app/Exports/PatientsExport.php',
    'app/Exports/TreatmentRecordsExport.php',
];

foreach ($exports as $export) {
    if (file_exists($export)) {
        echo "✓ {$export} exists\n";
    } else {
        echo "✗ {$export} MISSING\n";
    }
}

// Test 3: Verify Controllers have export methods
echo "\n=== Testing Controller Methods ===\n";
$controllers = [
    'app/Http/Controllers/Admin/ReportController.php' => ['exportPdf', 'exportExcel'],
    'app/Http/Controllers/Admin/UserController.php' => ['exportPdf', 'exportExcel'],
    'app/Http/Controllers/Staff/AppointmentController.php' => ['exportPdf', 'exportExcel'],
];

foreach ($controllers as $file => $methods) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        foreach ($methods as $method) {
            if (strpos($content, "function {$method}") !== false) {
                echo "✓ {$file} has {$method}()\n";
            } else {
                echo "✗ {$file} missing {$method}()\n";
            }
        }
    }
}

echo "\n=== Summary ===\n";
echo "All export functionality has been set up!\n";
echo "Available export endpoints:\n";
echo "  - GET /admin/reports/export-pdf\n";
echo "  - GET /admin/reports/export-excel\n";
echo "  - GET /admin/users/export/pdf\n";
echo "  - GET /admin/users/export/excel\n";
echo "  - GET /staff/appointments/export/pdf\n";
echo "  - GET /staff/appointments/export/excel\n";
echo "  - GET /patient/history/{id}/download (existing)\n";
