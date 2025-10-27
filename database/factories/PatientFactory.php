<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
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
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'notes' => $this->faker->sentence(),
            'birth_date' => $this->faker->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            // 'birth_date' => $this->faker->date('Y-m-d'),

            'password' => $this->faker->password(),
            'gender' => $this->faker->randomElement(['male', 'female']),
        ];
    }
}
