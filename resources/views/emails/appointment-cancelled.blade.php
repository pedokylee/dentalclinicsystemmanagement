<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0D9488; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
        .details { margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; display: inline-block; width: 150px; }
        .alert { background-color: #fee; padding: 10px; border-left: 4px solid #c33; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Appointment Cancelled</h2>
        </div>
        
        <div class="content">
            <p>Dear {{ $appointment->patient->full_name }},</p>
            
            <p>Your dental appointment has been cancelled.</p>
            
            <div class="details">
                <h3>Appointment Details:</h3>
                <div class="detail-row">
                    <span class="label">Date:</span>
                    {{ $appointment->appointment_date->format('F d, Y') }}
                </div>
                <div class="detail-row">
                    <span class="label">Time:</span>
                    {{ $appointment->appointment_time }}
                </div>
                <div class="detail-row">
                    <span class="label">Type:</span>
                    {{ $appointment->type }}
                </div>
                <div class="detail-row">
                    <span class="label">Dentist:</span>
                    {{ $appointment->dentist->user->name }}
                </div>
            </div>
            
            <div class="alert">
                <strong>Cancellation Reason:</strong><br>
                {{ $reason }}
            </div>
            
            <p>If you have any questions or would like to reschedule, please contact us at your earliest convenience.</p>
            
            <p>Thank you for your understanding.</p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} DCMS - Dental Clinic Management System</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
