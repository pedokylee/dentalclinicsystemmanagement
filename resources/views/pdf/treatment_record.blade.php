<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #0D9488; margin: 0; }
        .header p { margin: 5px 0; color: #666; }
        .section { margin-bottom: 20px; page-break-inside: avoid; }
        .section-title { background-color: #0D9488; color: white; padding: 10px; margin-bottom: 10px; font-weight: bold; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { width: 150px; font-weight: bold; color: #0D9488; }
        .info-value { flex: 1; }
        .procedures-list { list-style-type: none; padding-left: 0; }
        .procedures-list li { padding: 5px 0; background-color: #f5f5f5; padding: 8px; margin-bottom: 5px; }
        .prescription-box { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; }
        .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DCMS - Treatment Record</h1>
        <p>Dental Clinic Management System</p>
    </div>

    <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">{{ $record->patient->full_name }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Date of Birth:</div>
            <div class="info-value">{{ $record->patient->date_of_birth->format('M d, Y') }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Contact:</div>
            <div class="info-value">{{ $record->patient->contact_number }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Medical Alerts:</div>
            <div class="info-value">{{ $record->patient->medical_alerts ?? 'None' }}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Treatment Details</div>
        <div class="info-row">
            <div class="info-label">Visit Date:</div>
            <div class="info-value">{{ $record->visit_date->format('M d, Y') }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Dentist:</div>
            <div class="info-value">{{ $record->dentist->user->name }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Specialization:</div>
            <div class="info-value">{{ $record->dentist->specialization ?? 'General' }}</div>
        </div>
    </div>

    @if ($record->procedures)
    <div class="section">
        <div class="section-title">Procedures</div>
        <ul class="procedures-list">
            @foreach($record->procedures as $procedure)
                <li>{{ $procedure }}</li>
            @endforeach
        </ul>
    </div>
    @endif

    @if ($record->notes)
    <div class="section">
        <div class="section-title">Notes</div>
        <p>{{ $record->notes }}</p>
    </div>
    @endif

    @if ($record->prescription)
    <div class="section">
        <div class="section-title">Prescription</div>
        <div class="prescription-box">
            {{ $record->prescription }}
        </div>
    </div>
    @endif

    <div class="footer">
        <p>Generated on {{ now()->format('M d, Y H:i A') }} | DCMS v1.0</p>
    </div>
</body>
</html>
