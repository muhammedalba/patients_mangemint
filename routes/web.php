<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

});




// الصفحة الرئيسية
// Route::get('/', function () {
//     return view('welcome');
// });

// Users / Patients
Route::middleware(['auth','verified','role.redirect:admin|doctor'])->prefix('users')->controller(UserController::class)->group(function () {
    Route::get('/', 'index')->name('users.index');
    Route::get('create', 'create')->name('users.create');
    Route::post('store', 'store')->name('users.store');
    Route::get('edit/{user}', 'edit')->name('users.edit');
    Route::post('update/{user}', 'update')->name('users.update');
    Route::delete('delete/{user}', 'destroy')->name('users.destroy');
});




Route::middleware(['auth','verified','role.redirect:admin|doctor'])->prefix('patients')->controller(PatientController::class)->group(function () {
    Route::get('/', 'index')->name('patients.index');
    Route::get('create', 'create')->name('patients.create');
    Route::post('store', 'store')->name('patients.store');
    Route::get('edit/{patient}', 'edit')->name('patients.edit');
    Route::patch('update/{patient}', 'update')->name('patients.update');
    // show patient details
    Route::get('show/{patient}', 'show')->name('patients.show');
    Route::delete('delete/{patient}', 'destroy')->name('patients.destroy');
});
// Procedures


Route::prefix('procedures')->controller(ProcedureController::class)->group(function () {
    Route::get('/', 'index')->name('procedures.index');
    Route::get('create', 'create')->name('procedures.create');
    Route::post('store', 'store')->name('procedures.store');
    Route::get('edit/{procedure}', 'edit')->name('procedures.edit');
    Route::post('update/{procedure}', 'update')->name('procedures.update');
    Route::delete('delete/{procedure}', 'destroy')->name('procedures.destroy');
});

// Appointments
Route::resource('appointments', AppointmentController::class)->middleware(['auth', 'verified']);

// Medical Records
Route::prefix('medicalrecords')->controller(MedicalRecordController::class)->group(function () {
    Route::get('/', 'index')->name('medicalrecords.index');
    Route::get('create', 'create')->name('medicalrecords.create');
    Route::post('store', 'store')->name('medicalrecords.store');
    Route::get('edit/{id}', 'edit')->name('medicalrecords.edit');
    Route::post('update/{id}', 'update')->name('medicalrecords.update');
    Route::delete('delete/{id}', 'destroy')->name('medicalrecords.destroy');
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
    Route::get('edit/{id}', 'edit')->name('payments.edit');
    Route::post('update/{id}', 'update')->name('payments.update');
    Route::delete('delete/{id}', 'destroy')->name('payments.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
