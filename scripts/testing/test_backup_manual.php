#!/usr/bin/env php
<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Manually test backup creation
echo "\n╔════════════════════════════════════════════════════════════════╗\n";
echo "║          BACKUP MANUAL TEST - Simulating Store Request          ║\n";
echo "╚════════════════════════════════════════════════════════════════╝\n\n";

try {
    $timestamp = date('Y-m-d_H-i-s');
    $dbPath = database_path('database.sqlite');
    
    echo "Step 1: Check database file\n";
    echo "   Path: {$dbPath}\n";
    echo "   Exists: " . (file_exists($dbPath) ? "✅ YES" : "❌ NO") . "\n";
    
    if (!file_exists($dbPath)) {
        echo "\n❌ Database file not found!\n";
        exit(1);
    }
    
    $dbSize = filesize($dbPath);
    echo "   Size: " . number_format($dbSize) . " bytes\n\n";
    
    echo "Step 2: Create backup directory\n";
    $backupDir = storage_path('app/backups');
    echo "   Path: {$backupDir}\n";
    
    if (!is_dir($backupDir)) {
        $result = @mkdir($backupDir, 0755, true);
        echo "   mkdir result: " . ($result ? "✅ SUCCESS" : "❌ FAILED") . "\n";
        
        if (!$result) {
            echo "   Error: " . (error_get_last()['message'] ?? 'Unknown') . "\n";
        }
    } else {
        echo "   Already exists ✅\n";
    }
    
    echo "   Writable: " . (is_writable($backupDir) ? "✅ YES" : "❌ NO") . "\n\n";
    
    echo "Step 3: Copy database file\n";
    $filename = "backup_{$timestamp}.sqlite";
    $backupPath = "{$backupDir}/{$filename}";
    echo "   From: {$dbPath}\n";
    echo "   To: {$backupPath}\n";
    
    $copyResult = @copy($dbPath, $backupPath);
    echo "   Copy result: " . ($copyResult ? "✅ SUCCESS" : "❌ FAILED") . "\n";
    
    if (!$copyResult) {
        $error = error_get_last();
        echo "   Error: " . ($error ? $error['message'] : 'Unknown error') . "\n";
        exit(1);
    }
    
    echo "\nStep 4: Verify backup\n";
    echo "   File exists: " . (file_exists($backupPath) ? "✅ YES" : "❌ NO") . "\n";
    
    if (file_exists($backupPath)) {
        $backupSize = filesize($backupPath);
        echo "   Size: " . number_format($backupSize) . " bytes\n";
        $backupTime = date('M d, Y H:i', filemtime($backupPath));
        echo "   Created: {$backupTime}\n";
    }
    
    echo "\nStep 5: List all backups\n";
    if (is_dir($backupDir)) {
        $files = @array_diff(scandir($backupDir), ['.', '..']);
        if ($files && count($files) > 0) {
            foreach ($files as $file) {
                $filePath = $backupDir . '/' . $file;
                if (is_file($filePath)) {
                    $size = filesize($filePath);
                    $date = date('M d, Y H:i', filemtime($filePath));
                    echo "   ✅ {$file} ({$size} bytes, {$date})\n";
                }
            }
        } else {
            echo "   No backups found\n";
        }
    }
    
    echo "\n╔════════════════════════════════════════════════════════════════╗\n";
    echo "║                   ✅ ALL TESTS PASSED                         ║\n";
    echo "╚════════════════════════════════════════════════════════════════╝\n\n";
    echo "Backup system is working correctly!\n";
    echo "Try clicking 'Create Backup' in the admin panel again.\n\n";
    
} catch (\Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n\n";
    exit(1);
}
