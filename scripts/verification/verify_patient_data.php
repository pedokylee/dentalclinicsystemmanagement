<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Patient;
use App\Models\Dentist;
use App\Models\Appointment;

echo "=== VERIFYING PATIENT DATA ===\n\n";

// Check first patient
$patient = Patient::first();
echo "First Patient Record:\n";
echo "ID: " . $patient->id . "\n";
echo "First Name: " . $patient->first_name . "\n";
echo "Last Name: " . $patient->last_name . "\n";
echo "Contact Number: " . $patient->contact_number . "\n";
echo "Phone: " . $patient->phone . "\n";
echo "Medical Alerts: " . $patient->medical_alerts . "\n";
echo "Email: " . $patient->email . "\n";
echo "Date of Birth: " . $patient->date_of_birth . "\n";
echo "Full Name (accessor): " . $patient->full_name . "\n";
echo "Age (accessor): " . $patient->age . "\n";

echo "\n=== CHECKING DENTIST PATIENTS ===\n\n";

$dentist = Dentist::first();
if ($dentist) {
    echo "Dentist ID: " . $dentist->id . "\n\n";
    
    $patients = Patient::whereIn('id', function ($query) use ($dentist) {
        $query->select('patient_id')
            ->from('appointments')
            ->where('dentist_id', $dentist->id)
            ->distinct();
    })->limit(3)->get();
    
    echo "Patients for this dentist:\n";
    foreach ($patients as $p) {
        echo "\n- ID: " . $p->id;
        echo "\n  Full Name: " . $p->full_name;
        echo "\n  Contact: " . ($p->contact_number ?: 'NULL');
        echo "\n  Medical Alerts: " . ($p->medical_alerts ?: 'None');
        echo "\n";
    }
} else {
    echo "No dentists found!\n";
}

echo "\n=== DATABASE STRUCTURE CHECK ===\n\n";

// Check columns
$columns = \Illuminate\Support\Facades\DB::getSchemaBuilder()->getColumnListing('patients');
echo "Patient table columns:\n";
foreach ($columns as $col) {
    echo "- $col\n";
}

echo "\n✅ Verification complete!\n";
