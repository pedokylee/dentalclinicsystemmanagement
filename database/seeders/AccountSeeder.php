<?php

namespace Database\Seeders;

use App\Models\Dentist;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Garcia',
            'email' => 'admin@dcms.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $dentist1User = User::create([
            'name' => 'Dr. Maria Cruz',
            'email' => 'mcruz@dcms.com',
            'password' => Hash::make('password'),
            'role' => 'dentist',
            'email_verified_at' => now(),
        ]);

        Dentist::create([
            'user_id' => $dentist1User->id,
            'specialization' => 'General Dentistry',
            'schedule_days' => json_encode(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
        ]);

        $dentist2User = User::create([
            'name' => 'Dr. James Lim',
            'email' => 'jlim@dcms.com',
            'password' => Hash::make('password'),
            'role' => 'dentist',
            'email_verified_at' => now(),
        ]);

        Dentist::create([
            'user_id' => $dentist2User->id,
            'specialization' => 'Orthodontics',
            'schedule_days' => json_encode(['Monday', 'Wednesday', 'Friday', 'Saturday']),
        ]);

        User::create([
            'name' => 'Ana Sta. Maria',
            'email' => 'staff@dcms.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Mark Reyes',
            'email' => 'mark.receptionist@dcms.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Lisa Santos',
            'email' => 'lisa.admin@dcms.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        $patientAccounts = [
            ['Juan', 'Santos', 'juan.santos@patient.com'],
            ['Maria', 'Garcia', 'maria.garcia@patient.com'],
            ['Carlos', 'Villanueva', 'carlos.villanueva@patient.com'],
            ['Michael', 'Brown', 'michael.brown@patient.com'],
            ['Sarah', 'Johnson', 'sarah.johnson@patient.com'],
            ['Emily', 'Davis', 'emily.davis@patient.com'],
            ['James', 'Wilson', 'james.wilson@patient.com'],
            ['Jennifer', 'Martinez', 'jennifer.martinez@patient.com'],
            ['David', 'Anderson', 'david.anderson@patient.com'],
            ['Linda', 'Taylor', 'linda.taylor@patient.com'],
            ['Robert', 'Thomas', 'robert.thomas@patient.com'],
            ['Susan', 'Jackson', 'susan.jackson@patient.com'],
            ['William', 'White', 'william.white@patient.com'],
            ['Mary', 'Harris', 'mary.harris@patient.com'],
            ['Charles', 'Martin', 'charles.martin@patient.com'],
            ['Patricia', 'Moore', 'patricia.moore@patient.com'],
            ['Mark', 'Rodriguez', 'mark.rodriguez@patient.com'],
            ['Catherine', 'Lewis', 'catherine.lewis@patient.com'],
        ];

        foreach ($patientAccounts as [$firstName, $lastName, $email]) {
            User::create([
                'name' => "{$firstName} {$lastName}",
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'patient',
                'email_verified_at' => now(),
            ]);
        }

        echo "\nAccounts seeded successfully.\n";
        echo "Created: 1 Admin, 2 Dentists, 3 Staff, 18 Patients (24 users total)\n\n";
    }
}
