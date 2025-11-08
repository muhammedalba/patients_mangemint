<?php

namespace Database\Factories;

use App\Models\MedicalRecord;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicalRecordFactory extends Factory
{
    protected $model = MedicalRecord::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(), // أو يمكنك استخدام patient موجود
            'doctor_id' => User::inRandomOrder()->first()?->id,
            'attachments' => $this->faker->randomElement([null, json_encode(['xray1.jpg', 'report.pdf'])]),

            'chief_complaint' => $this->faker->sentence(),
            'present_illness_history' => $this->faker->paragraph(),
            'past_dental_history' => $this->faker->paragraph(),

            'has_cardiovascular_disease' => $this->faker->boolean(10),
            'has_hypertension' => $this->faker->boolean(15),
            'has_respiratory_disease' => $this->faker->boolean(10),
            'has_gastrointestinal_disease' => $this->faker->boolean(8),
            'has_neural_disease' => $this->faker->boolean(7),
            'has_hepatic_disease' => $this->faker->boolean(6),
            'has_renal_disease' => $this->faker->boolean(5),
            'has_endocrine_disease' => $this->faker->boolean(5),
            'has_diabetes' => $this->faker->boolean(12),
            'medical_disease_details' => $this->faker->boolean(20) ? $this->faker->sentence() : null,

            'allergic_to' => $this->faker->boolean(15) ? $this->faker->word() : null,
            'current_medications' => $this->faker->boolean(20) ? $this->faker->sentence() : null,

            'hospitalized_or_operated' => $this->faker->boolean(10),
            'hospital_details' => $this->faker->boolean(10) ? $this->faker->sentence() : null,
            'abnormal_bleeding_history' => $this->faker->boolean(8),
            'is_pregnant' => $this->faker->boolean(5),
            'pregnancy_trimester' => $this->faker->randomElement([null, 'I', 'II', 'III']),

            'clinical_notes' => $this->faker->boolean(50) ? $this->faker->paragraph() : null,
        ];
    }
}
