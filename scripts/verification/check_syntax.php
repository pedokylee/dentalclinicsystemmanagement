<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    $patient = \App\Models\Patient::first();
    echo "✅ Patient model loaded successfully!\n";
    echo "Total patients: " . \App\Models\Patient::count() . "\n";
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
