<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\AuditLog;

class BackupController extends Controller
{
    private function backupPath(string $fileName): string
    {
        abort_unless(preg_match('/^backup_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.sqlite$/', $fileName), 404);

        return storage_path("app/backups/{$fileName}");
    }

    public function index()
    {
        $backups = [];
        $backupDir = storage_path('app/backups');
        
        if (is_dir($backupDir)) {
            $files = array_diff(scandir($backupDir), ['.', '..']);
            foreach ($files as $file) {
                // Only list files matching backup naming pattern
                if (!preg_match('/^backup_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.sqlite$/', $file)) {
                    continue;
                }
                
                $filePath = "{$backupDir}/{$file}";
                if (is_file($filePath)) {
                    $backups[] = [
                        'name' => $file,
                        'size' => filesize($filePath),
                        'date' => date('M d, Y H:i', filemtime($filePath)),
                    ];
                }
            }
        }
        
        // Sort by date, newest first
        usort($backups, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        return Inertia::render('Admin/Backup', ['backups' => $backups]);
    }

    public function store()
    {
        try {
            $timestamp = date('Y-m-d_H-i-s');
            $dbPath = database_path('database.sqlite');
            
            // Validate database exists
            if (!file_exists($dbPath)) {
                \Log::error('Backup: Database file not found at ' . $dbPath);
                return back()->with('error', 'Database file not found at: ' . $dbPath);
            }

            $backupDir = storage_path('app/backups');
            
            // Create backup directory if it doesn't exist
            if (!is_dir($backupDir)) {
                $mkdirResult = @mkdir($backupDir, 0755, true);
                if (!$mkdirResult) {
                    \Log::error('Backup: Failed to create directory ' . $backupDir);
                    return back()->with('error', 'Failed to create backup directory.');
                }
                \Log::info('Backup: Created directory ' . $backupDir);
            }

            // Ensure directory is writable
            if (!is_writable($backupDir)) {
                \Log::error('Backup: Directory not writable ' . $backupDir);
                return back()->with('error', 'Backup directory is not writable.');
            }

            $filename = "backup_{$timestamp}.sqlite";
            $backupPath = "{$backupDir}/{$filename}";
            
            // Copy database file (SQLite backup)
            $copyResult = @copy($dbPath, $backupPath);
            if (!$copyResult) {
                $error = error_get_last();
                \Log::error('Backup: Failed to copy database', [
                    'from' => $dbPath,
                    'to' => $backupPath,
                    'error' => $error ? $error['message'] : 'Unknown error'
                ]);
                return back()->with('error', 'Failed to create backup. Check server logs.');
            }

            // Verify backup was created
            if (!file_exists($backupPath)) {
                \Log::error('Backup: File was copied but does not exist at ' . $backupPath);
                return back()->with('error', 'Backup file was not created.');
            }

            $backupSize = filesize($backupPath);
            \Log::info('Backup: Successfully created', [
                'filename' => $filename,
                'size' => $backupSize,
                'path' => $backupPath
            ]);

            AuditLog::log('created', 'backups', "Created database backup: {$filename} ({$backupSize} bytes)");

            return back()->with('success', "Backup created successfully ({$backupSize} bytes).");
        } catch (\Exception $e) {
            \Log::error('Backup: Exception occurred', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return back()->with('error', 'Failed to create backup: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $backupPath = $this->backupPath($id);

            if (!file_exists($backupPath)) {
                return back()->with('error', 'Backup file not found.');
            }

            AuditLog::log('downloaded', 'backups', "Downloaded backup: {$id}");

            return response()->download($backupPath);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to download backup: ' . $e->getMessage());
        }
    }

    public function update(string $backup)
    {
        try {
            $backupPath = $this->backupPath($backup);
            $databasePath = database_path('database.sqlite');

            if (!file_exists($backupPath)) {
                return back()->with('error', 'Backup file not found.');
            }

            if (!file_exists($databasePath)) {
                touch($databasePath);
            }

            if (!@copy($backupPath, $databasePath)) {
                return back()->with('error', 'Failed to restore backup.');
            }

            AuditLog::log('restored', 'backups', "Restored backup: {$backup}");

            return redirect()->route('admin.backup.index')->with('success', 'Backup restored successfully.');
        } catch (\Throwable $exception) {
            return back()->with('error', 'Failed to restore backup: ' . $exception->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $backupPath = $this->backupPath($id);

            if (!file_exists($backupPath)) {
                return back()->with('error', 'Backup file not found.');
            }

            unlink($backupPath);
            AuditLog::log('deleted', 'backups', "Deleted backup: {$id}");
            
            return back()->with('success', 'Backup deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete backup: ' . $e->getMessage());
        }
    }
}
