<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentCancelled;
use App\Models\Appointment;
use App\Models\Patient;

try {
    echo "=== Testing Email System ===\n\n";
    
    // Get first appointment
    $appointment = Appointment::first();
    
    if (!$appointment) {
        echo "❌ No appointments found in database\n";
        exit(1);
    }
    
    echo "Appointment ID: " . $appointment->id . "\n";
    echo "Patient Email: " . $appointment->patient->email . "\n";
    echo "MAIL_MAILER: " . config('mail.default') . "\n";
    echo "MAIL_HOST: " . config('mail.mailers.smtp.host') . "\n";
    echo "MAIL_PORT: " . config('mail.mailers.smtp.port') . "\n\n";
    
    echo "Attempting to send email...\n";
    
    Mail::to($appointment->patient->email)->send(new AppointmentCancelled($appointment, 'Test email'));
    
    echo "✅ Email sent successfully!\n";
    echo "Check http://localhost:8025 to see the email\n";
    
} catch (\Exception $e) {
    echo "❌ Error sending email:\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    exit(1);
}
