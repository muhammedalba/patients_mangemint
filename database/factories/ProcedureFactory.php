<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teeth>
 */
class ProcedureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tooth_id' => \App\Models\Tooth::factory(),
            'patient_id' => \App\Models\Patient::factory(),
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'cost' => $this->faker->randomFloat(2, 50, 500),
            'duration_minutes' => $this->faker->numberBetween(15, 120),
            'follow_up_days' => $this->faker->numberBetween(0, 30),
        ];
    }
}
