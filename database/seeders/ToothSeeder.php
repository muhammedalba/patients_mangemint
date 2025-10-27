<?php

namespace Database\Seeders;

use App\Models\Tooth;
use Illuminate\Database\Seeder;

class ToothSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Tooth::factory()->count(10)->create();
    }
}
