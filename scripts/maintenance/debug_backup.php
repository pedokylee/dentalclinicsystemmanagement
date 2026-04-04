<?php

// Debug backup creation
require __DIR__ . '/bootstrap/app.php';

echo "\n╔════════════════════════════════════════════════════════════════╗\n";
echo "║              BACKUP SYSTEM DEBUG REPORT                        ║\n";
echo "╚════════════════════════════════════════════════════════════════╝\n\n";

// 1. Check database location
echo "1. DATABASE LOCATION:\n";
echo str_repeat("─", 64) . "\n";

$dbPath = database_path('database.sqlite');
echo "   Expected path: {$dbPath}\n";
echo "   File exists: " . (file_exists($dbPath) ? "✅ YES" : "❌ NO") . "\n";

if (file_exists($dbPath)) {
    $size = filesize($dbPath);
    echo "   File size: " . number_format($size) . " bytes\n";
    echo "   Readable: " . (is_readable($dbPath) ? "✅ YES" : "❌ NO") . "\n";
    echo "   Writable: " . (is_writable($dbPath) ? "✅ YES" : "⚠️  NO") . "\n\n";
} else {
    echo "\n❌ DATABASE FILE NOT FOUND - BACKUP CANNOT WORK\n\n";
}

// 2. Check backup directory
echo "2. BACKUP DIRECTORY:\n";
echo str_repeat("─", 64) . "\n";

$backupDir = storage_path('app/backups');
echo "   Path: {$backupDir}\n";
echo "   Exists: " . (is_dir($backupDir) ? "✅ YES" : "❌ NO") . "\n";

if (is_dir($backupDir)) {
    echo "   Writable: " . (is_writable($backupDir) ? "✅ YES" : "⚠️  NO") . "\n";
} 

echo "\n";

// 3. Check storage directory permissions
echo "3. STORAGE PERMISSIONS:\n";
echo str_repeat("─", 64) . "\n";

$storageDir = storage_path('app');
echo "   Storage path: {$storageDir}\n";
echo "   Exists: " . (is_dir($storageDir) ? "✅ YES" : "❌ NO") . "\n";
echo "   Writable: " . (is_writable($storageDir) ? "✅ YES" : "⚠️  NO") . "\n\n";

// 4. Test backup creation
echo "4. TEST BACKUP CREATION:\n";
echo str_repeat("─", 64) . "\n";

if (file_exists($dbPath)) {
    if (!is_dir($backupDir)) {
        $mkdir = mkdir($backupDir, 0755, true);
        echo "   Created backup directory: " . ($mkdir ? "✅" : "❌") . "\n";
    }
    
    $testBackup = $backupDir . '/test_backup_' . date('Y-m-d_H-i-s') . '.sqlite';
    $result = copy($dbPath, $testBackup);
    
    if ($result) {
        echo "   ✅ Test backup created successfully\n";
        echo "   Backup file: " . basename($testBackup) . "\n";
        echo "   Size: " . number_format(filesize($testBackup)) . " bytes\n";
        
        // Clean up test backup
        if (file_exists($testBackup)) {
            unlink($testBackup);
            echo "   Cleaned up test backup\n";
        }
    } else {
        echo "   ❌ Failed to create test backup\n";
        echo "   Reason: Copy operation failed. Check file permissions.\n";
    }
} else {
    echo "   ❌ Cannot test - database file not found\n";
}

echo "\n5. EXISTING BACKUPS:\n";
echo str_repeat("─", 64) . "\n";

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
} else {
    echo "   Backup directory does not exist yet\n";
}

echo "\n╔════════════════════════════════════════════════════════════════╗\n";
echo "║                      RECOMMENDATIONS                          ║\n";
echo "╚════════════════════════════════════════════════════════════════╝\n\n";

$issues = [];

if (!file_exists($dbPath)) {
    $issues[] = "Database file not found - check DB_CONNECTION in .env";
}

if (is_dir($backupDir) && !is_writable($backupDir)) {
    $issues[] = "Backup directory not writable - check storage/app permissions";
}

if (!is_writable($storageDir)) {
    $issues[] = "Storage directory not writable - run: chmod -R 755 storage";
}

if (count($issues) === 0) {
    echo "✅ All systems operational\n";
    echo "   If backups still not showing after clicking 'Create Backup':\n";
    echo "   1. Check browser console for errors (F12)\n";
    echo "   2. Check Laravel log at: storage/logs/laravel.log\n";
    echo "   3. Verify CSRF token is being sent\n";
} else {
    echo "⚠️  Issues found:\n";
    foreach ($issues as $issue) {
        echo "   • {$issue}\n";
    }
}

echo "\n";
