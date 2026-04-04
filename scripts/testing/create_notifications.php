<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Notification;
use App\Models\User;

echo "=== Creating Test Notifications for Patients ===\n\n";

$patients = User::where('role', 'patient')->take(5)->get();

if ($patients->isEmpty()) {
    echo "No patient users found!\n";
    exit(1);
}

$notificationTypes = [
    'appointment_booked' => 'Your appointment has been booked',
    'appointment_confirmed' => 'Your appointment is confirmed',
    'appointment_reminder' => 'Reminder: Your appointment is tomorrow',
    'appointment_cancelled' => 'Your appointment has been cancelled',
];

foreach ($patients as $patient) {
    foreach ($notificationTypes as $type => $message) {
        $notification = Notification::create([
            'user_id' => $patient->id,
            'type' => $type,
            'title' => ucfirst(str_replace('_', ' ', $type)),
            'message' => $message,
            'read' => false,
            'related_id' => null,
        ]);
        
        echo "Created notification #{$notification->id} for {$patient->name} ({$patient->email})\n";
    }
}

echo "\n=== All Test Notifications Created ===\n";
echo "Patients can now see notifications in their dashboard.\n";
