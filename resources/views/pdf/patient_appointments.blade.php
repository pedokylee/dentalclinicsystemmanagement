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
        
        .status-confirmed {
            background-color: #10B981;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
        }
        
        .status-pending {
            background-color: #F59E0B;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
        }
        
        .status-cancelled {
            background-color: #EF4444;
            color: white;
            padding: 2px 6px;
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
        <h1>DCMS - My Appointments</h1>
        <p>Dental Clinic Management System - Personal Appointments Report</p>
        <div class="generated-date">Generated on {{ now()->format('M d, Y H:i A') }}</div>
    </div>

    <div class="section-title">Appointment History</div>

    <table class="data-table">
        <thead>
            <tr>
                <th>Dentist</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @forelse($appointments as $apt)
            <tr>
                <td>Dr. {{ $apt->dentist?->user?->name ?? 'N/A' }}</td>
                <td>{{ $apt->appointment_date?->format('M d, Y') ?? 'N/A' }}</td>
                <td>{{ $apt->appointment_time ?? 'N/A' }}</td>
                <td>{{ $apt->appointment_type ?? 'N/A' }}</td>
                <td>
                    <span class="status-{{ $apt->status }}">{{ ucfirst($apt->status) }}</span>
                </td>
                <td>{{ $apt->notes ?? '-' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">No appointments found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>DCMS v1.0 | Total Appointments: {{ $appointments->count() }} | All data is confidential and for authorized use only</p>
    </div>
</body>
</html>
