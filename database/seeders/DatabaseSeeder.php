<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Dentist;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\TreatmentRecord;
use App\Models\AuditLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Call separate seeders for accounts and data
        $this->call([
            AccountSeeder::class,
            DataSeeder::class,
        ]);
    }
}

