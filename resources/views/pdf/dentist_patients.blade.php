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
        
        .alert-badge {
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
        <h1>DCMS - My Patients</h1>
        <p>Dental Clinic Management System - Assigned Patients Report</p>
        <div class="generated-date">Generated on {{ now()->format('M d, Y H:i A') }}</div>
    </div>

    <div class="section-title">Assigned Patients List</div>

    <table class="data-table">
        <thead>
            <tr>
                <th>Patient Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Contact Number</th>
                <th>Address</th>
                <th>Medical Alerts</th>
            </tr>
        </thead>
        <tbody>
            @forelse($patients as $patient)
            <tr>
                <td>{{ $patient->full_name }}</td>
                <td>{{ $patient->date_of_birth?->format('M d, Y') ?? 'N/A' }}</td>
                <td>{{ ucfirst($patient->gender) ?? 'N/A' }}</td>
                <td>{{ $patient->contact_number ?? 'N/A' }}</td>
                <td>{{ $patient->address ?? 'N/A' }}</td>
                <td>
                    @if($patient->medical_alerts)
                        <span class="alert-badge">{{ $patient->medical_alerts }}</span>
                    @else
                        <span style="color: #999;">None</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">No patients found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>DCMS v1.0 | Total Patients: {{ $patients->count() }} | All data is confidential and for authorized use only</p>
    </div>
</body>
</html>
