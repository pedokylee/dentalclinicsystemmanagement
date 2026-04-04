<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentBooked;
use App\Models\Appointment;

try {
    echo "=== Testing Appointment Booking Email ===\n\n";
    
    // Get first appointment
    $appointment = Appointment::first();
    
    if (!$appointment) {
        echo "❌ No appointments found in database\n";
        exit(1);
    }
    
    echo "Appointment ID: " . $appointment->id . "\n";
    echo "Patient Email: " . $appointment->patient->email . "\n";
    echo "Dentist Email: " . $appointment->dentist->user->email . "\n\n";
    
    echo "Sending email to dentist...\n";
    Mail::to($appointment->dentist->user->email)->send(new AppointmentBooked($appointment, 'dentist'));
    echo "✅ Dentist email sent!\n\n";
    
    echo "Sending email to patient...\n";
    Mail::to($appointment->patient->email)->send(new AppointmentBooked($appointment, 'patient'));
    echo "✅ Patient email sent!\n\n";
    
    echo "Check http://localhost:8025 to see both emails\n";
    
} catch (\Exception $e) {
    echo "❌ Error sending email:\n";
    echo "Message: " . $e->getMessage() . "\n";
    exit(1);
}
