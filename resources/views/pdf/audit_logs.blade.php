<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #0D9488; margin: 0; }
        .header p { margin: 5px 0; color: #666; }
        .generated-date { margin-bottom: 20px; font-size: 12px; color: #999; }
        
        .section-title {
            background-color: #0D9488;
            color: white;
            padding: 12px;
            margin-top: 15px;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 14px;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
        }
        
        .data-table th {
            background-color: #0D9488;
            color: white;
            padding: 8px;
            text-align: left;
            border: 1px solid #0D9488;
        }
        
        .data-table td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        
        .data-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .action-badge {
            background-color: #0D9488;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
        }
        
        .footer {
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
            color: #999;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>DCMS - Audit Log</h1>
        <p>Dental Clinic Management System - System Activity Report</p>
        <div class="generated-date">Generated on {{ now()->format('M d, Y H:i A') }}</div>
    </div>

    <div class="section-title">System Audit Log</div>

    <table class="data-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Description</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @forelse($logs as $log)
            <tr>
                <td>{{ $log->id }}</td>
                <td>{{ $log->user?->name ?? 'System' }}</td>
                <td>
                    <span class="action-badge">{{ ucfirst($log->action) }}</span>
                </td>
                <td>{{ $log->module }}</td>
                <td>{{ $log->description }}</td>
                <td>{{ $log->created_at->format('M d, Y H:i') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">No audit logs found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>DCMS v1.0 | Total Audit Entries: {{ $logs->count() }} | All data is confidential and for authorized use only</p>
    </div>
</body>
</html>
