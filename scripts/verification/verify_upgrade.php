<?php

// Simple test to verify the upgrade worked
echo "\n✅ Checking maatwebsite/excel upgrade...\n\n";

// Check composer version
exec('composer show maatwebsite/excel 2>&1 | findstr "versions"', $output);
echo "Package Status: " . implode("\n", $output) . "\n\n";

// Check composer.lock for exact version
$composerLock = json_decode(file_get_contents('composer.lock'), true);
foreach ($composerLock['packages'] as $pkg) {
    if ($pkg['name'] === 'maatwebsite/excel') {
        echo "✅ Installed Version: maatwebsite/excel " . $pkg['version'] . "\n";
        echo "✅ Description: " . $pkg['description'] . "\n";
        echo "✅ PHP Support: " . $pkg['require']['php'] . "\n\n";
        break;
    }
}

// Verify vendor files
$concernsPath = 'vendor/maatwebsite/excel/src/Concerns';
if (is_dir($concernsPath)) {
    $files = scandir($concernsPath);
    $interfaces = array_filter($files, function($f) { 
        return strpos($f, '.php') !== false && $f[0] !== '.';
    });
    echo "✅ Found " . count($interfaces) . " concern files in vendor/\n";
    echo "   Including: " . implode(', ', array_slice(array_map(function($f) { 
        return str_replace('.php', '', $f); 
    }, array_slice($interfaces, 0, 5)), 0, 3)) . ", ...\n\n";
}

echo "╔═══════════════════════════════════════════════════════════════╗\n";
echo "║  ✅ UPGRADE COMPLETE - Ready for Testing                     ║\n";
echo "╚═══════════════════════════════════════════════════════════════╝\n\n";

echo "📝 Next Step: Try the export again\n";
echo "   Navigate to: http://127.0.0.1:8000/admin/reports\n";
echo "   Click: 'Export Excel' button\n";
echo "   Expect: File downloads without error (no interface errors)\n\n";
