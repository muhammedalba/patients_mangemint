<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teeth>
 */
class ToothFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'patient_id' => \App\Models\Patient::factory(),
            'tooth_number' => $this->faker->numberBetween(1, 32),
            'status' => $this->faker->randomElement(['healthy', 'decayed', 'filled', 'missing']),
            'notes' => $this->faker->sentence(),
        ];
    }
}
