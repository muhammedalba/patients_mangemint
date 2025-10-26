<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

// Patient::firstOrCreate(
//     ['name' => 'Test name'], // البحث عن هذا الاسم
//     [
//         'gender' => 'male',
//         'email' => 'emailcicbfj@gmail.com',
//         'phone' => '1234567890',
//         'address' => 'address',
//         'notes' => 'notes',
//         'birth_date' => '1990-01-01',
//         'password' => bcrypt('password'),
//         'email_verified_at' => now(),
//     ]
// );


// //         إنشاء صلاحيات
// //   إنشاء الصلاحيات الخاصة بتطبيق العيادة
//     $permissions = [
//         'manage patients',
//         'manage appointments',
//         'view medical records',
//         'edit medical records',
//         'manage billing',
//         'view dashboard',
//     ];

//     foreach ($permissions as $permission) {
//         Permission::create(['name' => $permission]);
//     }

//     // إنشاء الأدوار وربطها بالصلاحيات المناسبة

//     // المدير يمتلك جميع الصلاحيات
//     $adminRole = Role::create(['name' => 'admin']);
//     $adminRole->givePermissionTo($permissions);

//     // الطبيب يمكنه عرض وتعديل السجلات الطبية، وعرض لوحة التحكم
//     $doctorRole = Role::create(['name' => 'doctor']);
//     $doctorRole->givePermissionTo([
//         'view medical records',
//         'edit medical records',
//         'manage billing',
//         'view dashboard',
//     ]);

//     // السكرتير يدير المواعيد والمرضى
//     $receptionistRole = Role::create(['name' => 'receptionist']);
//     $receptionistRole->givePermissionTo([
//         'manage appointments',
//         'manage patients',
//         'manage billing',
//         'view dashboard',
//     ]);

    // المريض لا يمتلك صلاحيات إدارية
    // Role::create(['name' => 'patient']);
    // $user = User::where('email', 'muhammedalbahle@gmail.com')->first(); // أو مستخدم محدد
    //     $user->assignRole('admin');
}
}
