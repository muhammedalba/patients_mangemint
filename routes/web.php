<?php

use App\Http\Controllers\AppointmentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ServiceCategoriesController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\ToothController;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});



// Users
Route::middleware(['auth', 'verified', 'role.redirect:admin|doctor'])->prefix('users')->controller(UserController::class)->group(function () {
    Route::get('/', 'index')->name('users.index');
    Route::get('create', 'create')->name('users.create');
    Route::post('store', 'store')->name('users.store');
    Route::get('edit/{user}', 'edit')->name('users.edit');
    Route::post('update/{user}', 'update')->name('users.update');
    Route::delete('delete/{user}', 'destroy')->name('users.destroy');
});


// Patients

Route::middleware(['auth', 'verified', 'role.redirect:admin|doctor'])
    ->prefix('patients')
    ->as('patients.')
    ->group(function () {

        // Resource routes
        Route::resource('', PatientController::class)
            ->parameters(['' => 'patient'])
            ->names([
                'index'   => 'index',
                'create'  => 'create',
                'store'   => 'store',
                'edit'    => 'edit',
                'update'  => 'update',
                'destroy' => 'destroy',
            ]);

        // details route
        Route::get('details/{patient}/{tooth?}', [PatientController::class, 'details'])
            ->name('details');
    });


// Procedures


Route::prefix('procedures')->controller(ProcedureController::class)->group(function () {
    Route::get('/', 'index')->name('procedures.index');
    Route::get('create/{patient_id?}', 'create')->name('procedures.create');
    Route::post('store', 'store')->name('procedures.store'); // Updated to use ProcedureStoreRequest implicitly
    Route::get('edit/{procedure}', 'edit')->name('procedures.edit');
    Route::post('update/{procedure}', 'update')->name('procedures.update');
    Route::delete('delete/{procedure}', 'destroy')->name('procedures.destroy');
    Route::get('get-teeth/{patient}', 'getTeeth')->name('procedures.getTeeth');
});

// Appointments

Route::resource('appointments', AppointmentController::class)->middleware(['auth', 'verified']);

Route::prefix('available-slots')->controller(AppointmentController::class)->group(function () {
    Route::get('/', 'availableSlots')->name('appointments.availableSlots');
});



// services
Route::resource('services', ServicesController::class)->middleware(['auth', 'verified']);


// Medical Records

Route::prefix('medical-records')->controller(MedicalRecordController::class)->group(function () {
    Route::get('/', 'index')->name('medical-records.index');
    Route::get('create', 'create')->name('medical-records.create');
    Route::post('store', 'store')->name('medical-records.store');
    Route::get('edit/{medicalRecord}', 'edit')->name('medical-records.edit');
    Route::post('update/{medicalRecord}', 'update')->name('medical-records.update');
    Route::delete('delete/{medicalRecord}', 'destroy')->name('medical-records.destroy');
    Route::get('download/{medicalRecord}', 'download')->name('medical-records.download');
});

// Invoices
Route::prefix('invoices')->controller(InvoiceController::class)->group(function () {
    Route::get('/', 'index')->name('invoices.index');
    Route::get('create', 'create')->name('invoices.create');
    Route::post('store', 'store')->name('invoices.store');
    Route::get('edit/{id}', 'edit')->name('invoices.edit');
    Route::post('update/{id}', 'update')->name('invoices.update');
    Route::delete('delete/{id}', 'destroy')->name('invoices.destroy');
});

// Payments
Route::prefix('payments')->controller(PaymentController::class)->group(function () {
    Route::get('/', 'index')->name('payments.index');
    Route::get('create', 'create')->name('payments.create');
    Route::post('store', 'store')->name('payments.store');
    Route::get('edit/{payment}', 'edit')->name('payments.edit');
    Route::post('update/{payment}', 'update')->name('payments.update');
    Route::delete('delete/{payment}', 'destroy')->name('payments.destroy');
});

// Teeth
Route::prefix('teeth')->controller(ToothController::class)->group(function () {
    Route::get('/', 'index')->name('tooth.index');
    Route::get('create', 'create')->name('tooth.create');
    Route::post('store', 'store')->name('tooth.store');
    Route::get('edit/{tooth}', 'edit')->name('tooth.edit');
    Route::post('update/{tooth}', 'update')->name('tooth.update');
    Route::delete('delete/{tooth}', 'destroy')->name('tooth.destroy');
});
//service-categories
Route::resource('service-categories', ServiceCategoriesController::class)->names([
    'index' => 'service-categories.index',
    'create' => 'service-categories.create',
    'store' => 'service-categories.store',
    'show' => 'service-categories.show',
    'edit' => 'service-categories.edit',
    'update' => 'service-categories.update',
    'destroy' => 'service-categories.destroy',
]);





require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
