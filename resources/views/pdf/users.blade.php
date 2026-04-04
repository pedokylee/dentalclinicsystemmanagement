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
        
        .footer {
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
            color: #999;
            font-size: 11px;
        }
        
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DCMS - Users List</h1>
        <p>Dental Clinic Management System</p>
        <div class="generated-date">Generated on {{ now()->format('M d, Y H:i A') }}</div>
    </div>

    <div class="section-title">
        Users 
        @if($role !== 'all')
            (Role: {{ ucfirst($role) }})
        @endif
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Email Verified</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            @forelse($users as $user)
            <tr>
                <td>{{ $user->id }}</td>
                <td>{{ $user->name }}</td>
                <td>{{ $user->email }}</td>
                <td>{{ ucfirst($user->role) }}</td>
                <td>{{ $user->email_verified_at ? 'Yes' : 'No' }}</td>
                <td>{{ $user->created_at->format('M d, Y') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">No users found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>DCMS v1.0 | Total Users: {{ $users->count() }} | All data is confidential and for authorized use only</p>
    </div>
</body>
</html>
