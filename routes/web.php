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
        ExpenseCategoryController,
        ExpenseController,
        ExpenseAuditController,
        MonthClosureController,
        ToothController
    };




    Route::get('/', fn() => Inertia::render('auth/login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]))->name('home');

    // Shared middleware
    $protected = ['auth', 'verified', 'role.redirect:doctor|admin'];

    Route::middleware($protected)
        ->get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware($protected)
        ->get('/today', [DashboardController::class, 'statistics'])->name('statistics');

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
        // add dicount amount route
        Route::post('patients/{patient}/discount', [PatientController::class, 'addDiscount'])->name('patients.addDiscount');
        // patient details route
        Route::get('patients/details/{patient}',[PatientController::class, 'details'])->name('patients.details');
        // get Tooth Procedures
        Route::get('/patients/{patient}/tooth/{tooth}/procedures', [PatientController::class, 'getToothProcedures'])->name('patients.tooth.procedures');
        // create invoice for patient
        Route::get('patients/{patient}/download-invoice', [PatientController::class, 'downloadInvoice'])->name('patients.download-invoice');
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
            Route::get('create/{patient_id?}', 'create')->name('create');
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
            Route::get('create/{patient_id?}', 'create')->name('create');
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
            Route::get('create/{patient_id?}', 'create')->name('create');
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
            Route::get('create/{patient_id?}', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{tooth}/edit', 'edit')->name('edit');
            Route::put('{tooth}', 'update')->name('update');
            Route::delete('{tooth}', 'destroy')->name('destroy');
        });

    /*
    |--------------------------------------------------------------------------
    | Expense Categories
    |--------------------------------------------------------------------------
    */
    Route::middleware($protected)
        ->prefix('expense-categories')
        ->name('expense-categories.')
        ->controller(ExpenseCategoryController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{expenseCategory}/edit', 'edit')->name('edit');
            Route::patch('{expenseCategory}', 'update')->name('update');
            Route::delete('{expenseCategory}', 'destroy')->name('destroy');
        });

    /*
    |--------------------------------------------------------------------------
    | Expenses
    |--------------------------------------------------------------------------
    */
    Route::middleware($protected)
        ->prefix('expenses')
        ->name('expenses.')
        ->controller(ExpenseController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{expense}/edit', 'edit')->name('edit');
            Route::PATCH('{expense}', 'update')->name('update');
            Route::delete('{expense}', 'destroy')->name('destroy');
        });

    /*
    |--------------------------------------------------------------------------
    | Expense Audits
    |--------------------------------------------------------------------------
    */
    Route::middleware($protected)
        ->prefix('expenses/{expense}/audits')
        ->name('expense-audits.')
        ->controller(ExpenseAuditController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
        });

    /*
    |--------------------------------------------------------------------------
    | Month Closures
    |--------------------------------------------------------------------------
    */
    Route::middleware($protected)
        ->prefix('month-closures')
        ->name('month-closures.')
        ->controller(MonthClosureController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('close', 'close')->name('close');
            Route::post('close', 'closeMonth')->name('closeMonth');
            Route::delete('{monthClosure}', 'destroy')->name('destroy');
        });

    // Other route files
    require __DIR__ . '/settings.php';
    require __DIR__ . '/auth.php';
