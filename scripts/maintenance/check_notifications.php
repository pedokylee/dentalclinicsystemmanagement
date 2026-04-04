<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Notification;
use App\Models\User;

echo "=== Checking Notifications ===\n\n";

echo "Total notifications in database: " . Notification::count() . "\n";

echo "\nNotifications by user:\n";
foreach (User::where('role', 'patient')->limit(5)->get() as $user) {
    $count = Notification::where('user_id', $user->id)->count();
    echo "User: {$user->name} (ID: {$user->id}) - Notifications: {$count}\n";
}

echo "\nFirst 10 notifications:\n";
$notifications = Notification::orderBy('created_at', 'desc')
    ->limit(10)
    ->get();
    
foreach($notifications as $n) {
    echo "[{$n->id}] User {$n->user_id} - {$n->type} - {$n->title} - Read: " . ($n->read ? 'Yes' : 'No') . "\n";
}
