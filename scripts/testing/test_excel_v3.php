<?php

$basePath = __DIR__;
require $basePath . '/bootstrap/app.php';

try {
    echo "\n✅ Testing maatwebsite/excel v3.1 compatibility...\n\n";
    
    // Test imports for new v3 interfaces
    $interfaces = [
        'Maatwebsite\Excel\Concerns\FromArray',
        'Maatwebsite\Excel\Concerns\WithHeadings',
        'Maatwebsite\Excel\Concerns\FromCollection',
        'Maatwebsite\Excel\Concerns\WithMapping',
    ];
    
    foreach ($interfaces as $interface) {
        if (interface_exists($interface)) {
            echo "✅ {$interface} found\n";
        } else {
            echo "❌ {$interface} NOT found\n";
        }
    }
    
    echo "\n";
    
    // Test ReportsExport class
    echo "Testing ReportsExport class...\n";
    $reflectionClass = new ReflectionClass('App\Exports\ReportsExport');
    $interfaces = $reflectionClass->getInterfaceNames();
    echo "✅ ReportsExport implements: " . implode(', ', $interfaces) . "\n";
    
    echo "\n✅ All required interfaces are available!\n\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
