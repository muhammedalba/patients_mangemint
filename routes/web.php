 <?php

    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;



    // Controllers
    use App\Http\Controllers\{
        UserController,
        PatientController,
        ProcedureController,
        AppointmentController,
        DashboardController,
        MedicalRecordController,
        PaymentController,
        ServicesController,
        ServiceCategoriesController,
        ToothController
    };




    Route::get('/', fn() => Inertia::render('welcome'))->name('home');

    // Shared middleware
    $protected = ['auth', 'verified', 'role.redirect:doctor|admin'];

    Route::middleware($protected)
        ->get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    /*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)
        ->prefix('users')
        ->name('users.')
        ->controller(UserController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{user}/edit', 'edit')->name('edit');
            Route::put('{user}', 'update')->name('update');
            Route::delete('{user}', 'destroy')->name('destroy');
        });

    /*
|--------------------------------------------------------------------------
| Patients
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)->group(function () {
        Route::resource('patients', PatientController::class);

        Route::get(
            'patients/details/{patient}/{tooth?}',
            [PatientController::class, 'details']
        )->name('patients.details');
        // get Tooth Procedures
        Route::get('/patients/{patient}/tooth/{tooth}/procedures', [PatientController::class, 'getToothProcedures'])->name('patients.tooth.procedures');
    });

    /*
|--------------------------------------------------------------------------
| Procedures
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)
        ->name('procedures.')
        ->prefix('procedures')
        ->controller(ProcedureController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create/{patient?}', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{procedure}/edit', 'edit')->name('edit');
            Route::put('{procedure}', 'update')->name('update');
            Route::delete('{procedure}', 'destroy')->name('destroy');
            Route::get('get-teeth/{patient}', 'getTeeth')->name('getTeeth');
        });

    /*
|--------------------------------------------------------------------------
| Appointments
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)->group(function () {
        Route::resource('appointments', AppointmentController::class);
        Route::get('available-slots', [AppointmentController::class, 'availableSlots'])
            ->name('appointments.availableSlots');
    });

    /*
|--------------------------------------------------------------------------
| Services
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)
        ->resource('services', ServicesController::class);

    /*
|--------------------------------------------------------------------------
| Service Categories
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)
        ->resource('service-categories', ServiceCategoriesController::class);

    /*
|--------------------------------------------------------------------------
| Medical Records
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)
        ->prefix('medical-records')
        ->name('medical-records.')
        ->controller(MedicalRecordController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{medicalRecord}/edit', 'edit')->name('edit');
            Route::put('{medicalRecord}', 'update')->name('update');
            Route::delete('{medicalRecord}', 'destroy')->name('destroy');
            Route::get('{medicalRecord}/download', 'download')->name('download');
        });

    /*
|--------------------------------------------------------------------------
| Payments
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)
        ->prefix('payments')
        ->name('payments.')
        ->controller(PaymentController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{payment}/edit', 'edit')->name('edit');
            Route::put('{payment}', 'update')->name('update');
            Route::delete('{payment}', 'destroy')->name('destroy');
        });

    /*
|--------------------------------------------------------------------------
| Teeth
|--------------------------------------------------------------------------
*/
    Route::middleware($protected)
        ->prefix('teeth')
        ->name('teeth.')
        ->controller(ToothController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{tooth}/edit', 'edit')->name('edit');
            Route::put('{tooth}', 'update')->name('update');
            Route::delete('{tooth}', 'destroy')->name('destroy');
        });

    // Other route files
    require __DIR__ . '/settings.php';
    require __DIR__ . '/auth.php';
