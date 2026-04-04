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
        
        .summary-section {
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .summary-table td {
            padding: 12px;
            border: 1px solid #ddd;
        }
        
        .summary-table td:first-child {
            font-weight: bold;
            color: #0D9488;
            width: 50%;
        }
        
        .section-title {
            background-color: #0D9488;
            color: white;
            padding: 12px;
            margin-top: 15px;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 14px;
        }
        
        .chart-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
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
        
        .footer {
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
            color: #999;
            font-size: 11px;
        }
        
        .page-break { page-break-after: always; }
        .no-break { page-break-inside: avoid; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DCMS - Reports</h1>
        <p>Dental Clinic Management System</p>
        <div class="generated-date">Generated on {{ now()->format('M d, Y H:i A') }}</div>
    </div>

    <!-- Summary Section -->
    <div class="summary-section no-break">
        <div class="section-title">Monthly Summary</div>
        <table class="summary-table">
            <tr>
                <td>Total Appointments</td>
                <td>{{ $monthlySummary['appointments'] }}</td>
            </tr>
            <tr>
                <td>Total Patients</td>
                <td>{{ $monthlySummary['patients'] }}</td>
            </tr>
            <tr>
                <td>Monthly Revenue</td>
                <td>${{ $monthlySummary['revenue'] }}</td>
            </tr>
        </table>
    </div>

    <div class="page-break"></div>

    <!-- Appointments by Day -->
    <div class="chart-section">
        <div class="section-title">Appointments by Day (Last 7 Days)</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Appointments</th>
                </tr>
            </thead>
            <tbody>
                @foreach($dayLabels as $index => $label)
                <tr>
                    <td>{{ $label }}</td>
                    <td>{{ $appointmentsByDay[$index] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="page-break"></div>

    <!-- Patient Growth -->
    <div class="chart-section">
        <div class="section-title">Patient Growth (Last 8 Months)</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Month</th>
                    <th>New Patients</th>
                </tr>
            </thead>
            <tbody>
                @foreach($monthLabels as $index => $label)
                <tr>
                    <td>{{ $label }}</td>
                    <td>{{ $patientGrowth[$index] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="page-break"></div>

    <!-- Procedure Breakdown -->
    <div class="chart-section">
        <div class="section-title">Procedure Breakdown</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Procedure</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                @foreach($procedures as $index => $procedure)
                <tr>
                    <td>{{ $procedure }}</td>
                    <td>{{ $procedureData[$index] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>DCMS v1.0 | All data is confidential and for authorized use only</p>
    </div>
</body>
</html>
