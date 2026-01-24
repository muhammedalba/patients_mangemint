<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Payment;
use App\Models\User;
use App\Models\Procedure;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        $cacheKey = 'dashboard.stats';

        $stats = Cache::remember($cacheKey, now()->addMinutes(10), function () {
            $today = Carbon::today();
            $startOfMonth = Carbon::now()->startOfMonth();
            $endOfMonth = $startOfMonth->copy()->endOfMonth();

            // get Patient
            $patientsToday = Patient::whereDate('created_at', $today)->count();
            $patientsMonth = Patient::whereDate('created_at', '>=', $startOfMonth)->count();
            $totalPatients = Patient::count();


            // get Appointment
            $appointments = Appointment::select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->get();
            $appointmentsToday = Appointment::with(['patient:id,name', 'doctor:id,name', 'service:id,name'])
                ->whereDate('date', $today)
                ->orderBy('start_time')
                ->get();
            // أكثر الإجراءات طلبًا (حسب عدد المرضى الذين لديهم إجراء)
            $topProcedures = Procedure::select('procedures.name', DB::raw('count(procedures.id) as total'))
                ->join('patients', 'procedures.patient_id', '=', 'patients.id')
                ->groupBy('procedures.name')
                ->orderByDesc('total')
                ->limit(5)
                ->get();


            // Payment
            $revenueMonth = Payment::whereDate('payment_date', '>=', $startOfMonth)->sum('amount');
            $revenueTotal = Payment::sum('amount');

            // Expenses for current month
            $expensesMonth = Expense::whereBetween('expense_date', [
                $startOfMonth->toDateTimeString(),
                $endOfMonth->toDateTimeString(),
            ])->sum('amount');

            // Net profit (Revenue - Expenses) for current month
            $netProfitMonth = $revenueMonth - $expensesMonth;

            // Top expense category per type (fixed, variable) for current month
            $categoryTotals = DB::table('expenses')
                ->join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
                ->whereBetween('expense_date', [$startOfMonth->toDateTimeString(), $endOfMonth->toDateTimeString()])
                ->select(
                    'expense_categories.id as category_id',
                    'expense_categories.name as category_name',
                    'expense_categories.type as category_type',
                    DB::raw('SUM(expenses.amount) as total')
                )
                ->groupBy('expense_categories.id', 'expense_categories.name', 'expense_categories.type')
                ->orderByDesc('total')
                ->get();

            $topExpenseCategories = $categoryTotals
                ->groupBy('category_type')
                ->map(function ($items, $type) {
                    $top = $items->sortByDesc('total')->first();
                    return [
                        'type' => $type,
                        'category_name' => $top->category_name,
                        'total' => (float) $top->total,
                    ];
                })
                ->values()
                ->all();

            // get users
            $usersByRole = Role::withCount('users')->get();

            // doctor
            $doctorsCount = User::role('doctor')->count();

            return [
                'patients_today' => $patientsToday,
                'patients_month' => $patientsMonth,
                'total_patients' => $totalPatients,
                'appointments' => $appointments,
                'top_procedures' => $topProcedures,
                'revenue_month' => $revenueMonth,
                'revenue_total' => $revenueTotal,
                'users_by_role' => $usersByRole,
                'doctors_count' => $doctorsCount,
                'appointmentsToday' => $appointmentsToday,
                'expenses_month' => $expensesMonth,
                'net_profit_month' => $netProfitMonth,
                'top_expense_categories' => $topExpenseCategories,
            ];
        });
        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }

    public static function clearDashboardCache()
    {
        Cache::forget('dashboard.stats');
    }

    public function statistics()
{
    $appointmentsToday = Appointment::with(['patient', 'doctor'])
        ->whereDate('date', today())
        ->orderBy('start_time')
        ->get();

    return Inertia::render('Statistics', [
        'stats' => [
            'appointmentsToday' => $appointmentsToday,
        ],
    ]);
}

}
