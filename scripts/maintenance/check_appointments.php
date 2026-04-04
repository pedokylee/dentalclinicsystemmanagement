<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Appointment;
use Carbon\Carbon;

echo "=== Checking Appointments ===\n";
echo "Today: " . Carbon::today()->format('Y-m-d') . "\n\n";

echo "Total appointments: " . Appointment::count() . "\n";
echo "Appointments today: " . Appointment::where('appointment_date', Carbon::today())->count() . "\n";
echo "Appointments from today onwards: " . Appointment::where('appointment_date', '>=', Carbon::today())->count() . "\n\n";

echo "First 10 appointments:\n";
$appointments = Appointment::with('patient.user', 'dentist.user')
    ->orderBy('appointment_date')
    ->limit(10)
    ->get();

foreach($appointments as $a) {
    echo "[{$a->id}] {$a->appointment_date} {$a->appointment_time} - {$a->patient?->full_name} - Status: {$a->status}\n";
}
