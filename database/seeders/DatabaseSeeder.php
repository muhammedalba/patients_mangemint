<?php

namespace Database\Seeders;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        //  create roles and permissions
        //   $permissions = [
        //     'manage patients',
        //     'manage appointments',
        //     'view medical records',
        //     'edit medical records',
        //     'manage billing',
        //     'view dashboard',
        // ];

        // foreach ($permissions as $permission) {
        //     Permission::firstOrCreate(['name' => $permission]);
        // }

        // $adminRole = Role::firstOrCreate(['name' => 'admin']);
        // $adminRole->syncPermissions($permissions);

        // $doctorRole = Role::firstOrCreate(['name' => 'doctor']);
        // $doctorRole->syncPermissions([
        //     'view medical records',
        //     'edit medical records',
        //     'manage billing',
        //     'view dashboard',
        // ]);

        // $receptionistRole = Role::firstOrCreate(['name' => 'receptionist']);
        // $receptionistRole->syncPermissions([
        //     'manage appointments',
        //     'manage patients',
        //     'manage billing',
        //     'view dashboard',
        // ]);

        // Role::firstOrCreate(['name' => 'patient']);

        //  $user = User::firstOrCreate(
        //     ['email' => 'codeProps@gmail.com'],
        //     ['name' => 'Super Admin', 'password' => bcrypt('password')]
        // );
        // $user->assignRole('admin');

        // User::factory(10)->create();

        $this->call([
            PatientSeeder::class,
            ToothSeeder::class,
            ServiceSeeder::class,
        ]);


    }
}
