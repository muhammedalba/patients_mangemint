<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Payment;
use App\Models\User;
use App\Models\Procedure;
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

            // المرضى
            $patientsToday = Patient::whereDate('created_at', $today)->count();
            $patientsMonth = Patient::whereDate('created_at', '>=', $startOfMonth)->count();
            $totalPatients = Patient::count();

            // المواعيد حسب الحالة
            $appointments = Appointment::select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->get();

            // أكثر الإجراءات طلبًا (حسب عدد المرضى الذين لديهم إجراء)
            $topProcedures = Procedure::select('procedures.name', DB::raw('count(procedures.id) as total'))
                ->join('teeth', 'procedures.tooth_id', '=', 'teeth.id')
                ->join('patients', 'teeth.patient_id', '=', 'patients.id')
                ->groupBy('procedures.name')
                ->orderByDesc('total')
                ->limit(5)
                ->get();


            // الإيرادات
            $revenueMonth = Payment::whereDate('payment_date', '>=', $startOfMonth)->sum('amount');
            $revenueTotal = Payment::sum('amount');

            // المستخدمين حسب الدور
            $usersByRole = Role::withCount('users')->get();

            // الأطباء
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
            ];
        });
// @dd($stats);
        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }

    // يمكنك إضافة دالة لمسح الكاش عند إضافة دفعة أو إجراء أو سن جديد
    public static function clearDashboardCache()
    {
        Cache::forget('dashboard.stats');
    }
}
