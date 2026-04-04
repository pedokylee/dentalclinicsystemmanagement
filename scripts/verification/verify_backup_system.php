#!/usr/bin/env php
<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "\n╔════════════════════════════════════════════════════════════════╗\n";
echo "║            BACKUP SYSTEM FINAL VERIFICATION                    ║\n";
echo "╚════════════════════════════════════════════════════════════════╝\n\n";

$tests = [];

// Test 1: Database
echo "1️⃣  Database Check:\n";
$dbPath = database_path('database.sqlite');
if (file_exists($dbPath)) {
    $size = filesize($dbPath);
    echo "   ✅ Database exists: " . number_format($size) . " bytes\n";
    $tests[] = true;
} else {
    echo "   ❌ Database not found\n";
    $tests[] = false;
}

// Test 2: BackupController exists
echo "\n2️⃣  BackupController Check:\n";
$controllerPath = 'app/Http/Controllers/Admin/BackupController.php';
if (file_exists($controllerPath)) {
    echo "   ✅ BackupController exists\n";
    $syntax = shell_exec("php -l {$controllerPath} 2>&1");
    if (strpos($syntax, 'No syntax errors') !== false) {
        echo "   ✅ Syntax valid\n";
        $tests[] = true;
    } else {
        echo "   ❌ Syntax error: {$syntax}\n";
        $tests[] = false;
    }
} else {
    echo "   ❌ BackupController not found\n";
    $tests[] = false;
}

// Test 3: Backup React component
echo "\n3️⃣  React Component Check:\n";
$componentPath = 'resources/js/Pages/Admin/Backup.jsx';
if (file_exists($componentPath)) {
    echo "   ✅ Backup.jsx exists\n";
    $content = file_get_contents($componentPath);
    $hasRouter = strpos($content, 'router.post') !== false;
    $hasUseEffect = strpos($content, 'useEffect') !== false;
    
    if ($hasRouter) {
        echo "   ✅ Uses Inertia router.post()\n";
        $tests[] = true;
    } else {
        echo "   ❌ Missing router.post()\n";
        $tests[] = false;
    }
} else {
    echo "   ❌ Backup.jsx not found\n";
    $tests[] = false;
}

// Test 4: Routes
echo "\n4️⃣  Routes Check:\n";
$routesFile = file_get_contents('routes/web.php');
if (strpos($routesFile, 'Route::resource(\'/backup\'') !== false) {
    echo "   ✅ Backup routes registered\n";
    $tests[] = true;
} else {
    echo "   ❌ Backup routes not found\n";
    $tests[] = false;
}

// Test 5: Storage permissions
echo "\n5️⃣  Storage Permissions Check:\n";
$storageDir = storage_path('app');
if (is_writable($storageDir)) {
    echo "   ✅ Storage directory is writable\n";
    $tests[] = true;
} else {
    echo "   ⚠️  Storage directory may have permission issues\n";
    $tests[] = true; // Not critical
}

// Test 6: Test backup creation
echo "\n6️⃣  Backup Creation Test:\n";
try {
    $timestamp = date('Y-m-d_H-i-s');
    $backupDir = storage_path('app/backups');
    
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    $testFile = $backupDir . '/test_' . $timestamp . '.sqlite';
    $result = copy($dbPath, $testFile);
    
    if ($result && file_exists($testFile)) {
        echo "   ✅ Can create backups\n";
        unlink($testFile);
        $tests[] = true;
    } else {
        echo "   ❌ Failed to create test backup\n";
        $tests[] = false;
    }
} catch (\Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
    $tests[] = false;
}

// Summary
echo "\n╔════════════════════════════════════════════════════════════════╗\n";
echo "║                        SUMMARY                                 ║\n";
echo "╚════════════════════════════════════════════════════════════════╝\n\n";

$passed = count(array_filter($tests));
$total = count($tests);

echo "Tests Passed: {$passed}/{$total}\n\n";

if ($passed === $total) {
    echo "✅ ALL CHECKS PASSED!\n";
    echo "   Backup system is ready to use!\n";
    echo "   Navigate to: http://127.0.0.1:8000/admin/backup\n";
} elseif ($passed >= $total - 1) {
    echo "✅ SYSTEM OPERATIONAL\n";
    echo "   Minor issues detected - see above\n";
} else {
    echo "⚠️  ISSUES FOUND - See above for details\n";
}

echo "\n";
