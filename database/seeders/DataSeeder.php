<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Dentist;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\TreatmentRecord;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ===== LINK PATIENTS TO USERS & ADD PATIENT DATA =====
        $patientUsers = User::where('role', 'patient')->get();
        $patientData = [
            ['DOB' => '1995-03-15', 'gender' => 'Male', 'address' => '123 Oak Street, Manila', 'phone' => '09175551234', 'medical_alerts' => 'Allergic to penicillin'],
            ['DOB' => '1988-07-22', 'gender' => 'Female', 'address' => '456 Maple Avenue, Quezon City', 'phone' => '09275552345', 'medical_alerts' => 'Diabetic - monitor blood sugar'],
            ['DOB' => '1999-11-10', 'gender' => 'Male', 'address' => '789 Pine Road, Makati', 'phone' => '09375553456', 'medical_alerts' => ''],
            ['DOB' => '1992-05-18', 'gender' => 'Female', 'address' => '321 Elm Street, Pasig', 'phone' => '09475554567', 'medical_alerts' => 'Heart condition - take care'],
            ['DOB' => '1987-09-26', 'gender' => 'Male', 'address' => '654 Birch Lane, Caloocan', 'phone' => '09575555678', 'medical_alerts' => ''],
            ['DOB' => '1994-02-14', 'gender' => 'Female', 'address' => '987 Cedar Court, Las Piñas', 'phone' => '09675556789', 'medical_alerts' => 'Asthma - avoid triggers'],
            ['DOB' => '1991-08-03', 'gender' => 'Male', 'address' => '111 Ash Boulevard, Parañaque', 'phone' => '09775557890', 'medical_alerts' => ''],
            ['DOB' => '1996-12-28', 'gender' => 'Female', 'address' => '222 Willow Drive, Valenzuela', 'phone' => '09875558901', 'medical_alerts' => 'Pregnant - X-rays contraindicated'],
            ['DOB' => '1989-06-11', 'gender' => 'Male', 'address' => '333 Spruce Way, Malabon', 'phone' => '09975559012', 'medical_alerts' => ''],
            ['DOB' => '1993-10-19', 'gender' => 'Female', 'address' => '444 Fir Road, Navotas', 'phone' => '09075559901', 'medical_alerts' => 'Bleeding disorder - inform before treatment'],
            ['DOB' => '1990-04-07', 'gender' => 'Male', 'address' => '555 Chestnut Street, Pasay', 'phone' => '09175560110', 'medical_alerts' => ''],
            ['DOB' => '1997-01-25', 'gender' => 'Female', 'address' => '666 Oak Park, Manila', 'phone' => '09275561221', 'medical_alerts' => 'High blood pressure - monitor'],
            ['DOB' => '1986-11-09', 'gender' => 'Male', 'address' => '777 Maple Square, Quezon City', 'phone' => '09375562332', 'medical_alerts' => ''],
            ['DOB' => '1998-09-17', 'gender' => 'Female', 'address' => '888 Pine Villa, Makati', 'phone' => '09475563443', 'medical_alerts' => 'Severe anxiety - calming approach needed'],
            ['DOB' => '1985-03-22', 'gender' => 'Male', 'address' => '999 Elm Manor, Pasig', 'phone' => '09575564554', 'medical_alerts' => ''],
            ['DOB' => '2000-07-31', 'gender' => 'Female', 'address' => '1010 Birch Estates, Caloocan', 'phone' => '09675565665', 'medical_alerts' => 'Braces - electric toothbrush only'],
            ['DOB' => '1994-05-12', 'gender' => 'Male', 'address' => '1111 Cedar Heights, Las Piñas', 'phone' => '09775566776', 'medical_alerts' => ''],
            ['DOB' => '1992-10-05', 'gender' => 'Female', 'address' => '1212 Ash Gardens, Parañaque', 'phone' => '09875567887', 'medical_alerts' => 'Implants - avoid hard food'],
        ];

        $dentists = Dentist::all();

        foreach ($patientUsers as $index => $patientUser) {
            $data = $patientData[$index];
            $nameParts = explode(' ', $patientUser->name);
            $firstName = $nameParts[0];
            $lastName = count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : $firstName;

            Patient::create([
                'user_id' => $patientUser->id,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $patientUser->email,
                'date_of_birth' => $data['DOB'],
                'gender' => $data['gender'],
                'address' => $data['address'],
                'phone' => $data['phone'],
                'contact_number' => $data['phone'],
                'medical_alerts' => $data['medical_alerts'],
            ]);
        }

        echo "✅ Patient data seeded!\n";

        // ===== APPOINTMENTS =====
        $appointmentTypes = ['Routine Checkup', 'Cleaning', 'Root Canal', 'Extraction', 'Filling', 'Crown', 'Whitening', 'Orthodontic Adjustment'];
        $status = ['pending', 'pending', 'pending', 'confirmed', 'confirmed', 'cancelled'];
        $notes = [
            'Regular checkup and cleaning',
            'Follow-up for cavity treatment',
            'Root canal procedure planned',
            'Tooth extraction surgery',
            'Composite filling replacement',
            'Crown installation',
            'Teeth whitening treatment',
            'Orthodontic appointment',
            'Emergency dental care',
            'Post-treatment follow-up',
        ];

        // Create 20 past appointments
        for ($i = 0; $i < 20; $i++) {
            $patient = Patient::inRandomOrder()->first();
            $dentist = $dentists->random();
            $randomStatus = $status[array_rand($status)];

            Appointment::create([
                'patient_id' => $patient->id,
                'dentist_id' => $dentist->id,
                'type' => $appointmentTypes[array_rand($appointmentTypes)],
                'appointment_date' => Carbon::now()->subDays(rand(1, 90))->format('Y-m-d'),
                'appointment_time' => sprintf('%02d:%02d', rand(8, 17), rand(0, 1) ? 0 : 30),
                'status' => $randomStatus,
                'notes' => $notes[array_rand($notes)],
            ]);
        }

        // Create 25 upcoming appointments
        for ($i = 0; $i < 25; $i++) {
            $patient = Patient::inRandomOrder()->first();
            $dentist = $dentists->random();

            Appointment::create([
                'patient_id' => $patient->id,
                'dentist_id' => $dentist->id,
                'type' => $appointmentTypes[array_rand($appointmentTypes)],
                'appointment_date' => Carbon::now()->addDays(rand(1, 60))->format('Y-m-d'),
                'appointment_time' => sprintf('%02d:%02d', rand(8, 17), rand(0, 1) ? 0 : 30),
                'status' => 'pending',
                'notes' => $notes[array_rand($notes)],
            ]);
        }

        echo "✅ 45 Appointments seeded!\n";

        // ===== TREATMENT RECORDS =====
        $procedures = ['Extraction', 'Filling', 'Root Canal', 'Crown', 'Cleaning', 'Whitening', 'Scaling', 'Polishing'];

        for ($i = 0; $i < 15; $i++) {
            $patient = Patient::inRandomOrder()->first();
            $dentist = $dentists->random();

            // Create tooth data
            $toothData = [];
            for ($tooth = 1; $tooth <= 32; $tooth++) {
                $toothData[(string)$tooth] = [
                    'surface' => rand(0, 1) ? 'clean' : 'cavity',
                    'notes' => rand(0, 1) ? 'needs attention' : 'normal',
                ];
            }

            TreatmentRecord::create([
                'patient_id' => $patient->id,
                'dentist_id' => $dentist->id,
                'visit_date' => Carbon::now()->subDays(rand(1, 60))->format('Y-m-d'),
                'procedures' => [$procedures[array_rand($procedures)]],
                'notes' => 'Treatment completed successfully',
                'prescription' => 'Ibuprofen 400mg - 3 times daily, Amoxicillin 500mg - 2 times daily',
                'tooth_data' => $toothData,
            ]);
        }

        echo "✅ 15 Treatment Records seeded!\n";

        // ===== AUDIT LOGS =====
        $actions = ['create', 'update', 'delete', 'view', 'export', 'login', 'logout'];
        $modules = ['users', 'patients', 'appointments', 'treatment_records', 'system', 'backups'];

        for ($i = 0; $i < 34; $i++) {
            $user = User::inRandomOrder()->first();

            AuditLog::create([
                'user_id' => $user->id,
                'action' => $actions[array_rand($actions)],
                'module' => $modules[array_rand($modules)],
                'description' => 'System action performed by user',
            ]);
        }

        echo "✅ 34 Audit Logs seeded!\n";
        echo "\n📋 Data seeding completed!\n";
    }
}
