<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\User;

class MedicalRecordSeeder extends Seeder
{
    public function run(): void
    {
        // تأكد أولاً من وجود بعض المرضى والأطباء
        if (Patient::count() === 0) {
            Patient::factory(10)->create();
        }

        if (User::count() === 0) {
            User::factory(5)->create();
        }

        // إنشاء سجلات طبية للمرضى
        Patient::all()->each(function ($patient) {
            MedicalRecord::factory()->create([
                'patient_id' => $patient->id,
                'doctor_id' => User::inRandomOrder()->first()?->id,
            ]);
        });
    }
}
