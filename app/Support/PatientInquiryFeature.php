<?php

namespace App\Support;

use Illuminate\Support\Facades\Schema;

class PatientInquiryFeature
{
    public static function isAvailable(): bool
    {
        return Schema::hasTable('patient_inquiries');
    }

    public static function unavailableMessage(): string
    {
        return 'The new patient inquiry feature is not ready yet. Please run the latest database migrations or contact the clinic staff directly.';
    }
}
