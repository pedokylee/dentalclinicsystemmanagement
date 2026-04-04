<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Dentist;
use Carbon\Carbon;

echo "Creating test appointments for today...\n\n";

$today = Carbon::today();
$patients = Patient::with('user')->limit(5)->get();
$dentists = Dentist::with('user')->limit(3)->get();

if ($patients->isEmpty() || $dentists->isEmpty()) {
    echo "Error: No patients or dentists found in database!\n";
    exit(1);
}

$times = ['09:00', '10:00', '11:00', '14:00', '15:00'];
$types = ['Checkup', 'Cleaning', 'Filling', 'Root Canal'];

foreach ($patients as $index => $patient) {
    $appointment = Appointment::create([
        'patient_id' => $patient->id,
        'dentist_id' => $dentists[$index % $dentists->count()]->id,
        'appointment_date' => $today,
        'appointment_time' => $times[$index % count($times)],
        'type' => $types[$index % count($types)],
        'status' => 'pending',
        'confirmation_sent' => true,
    ]);
    echo "Created appointment #{$appointment->id} for {$patient->full_name} at {$appointment->appointment_time}\n";
}

echo "\n=== Check-in page should now show these appointments ===\n";
echo "Go to: http://127.0.0.1:8000/staff/checkin\n";
