<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index()
    {
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

        // أكثر الإجراءات طلبًا
        $topProcedures = DB::table('appointments as a')
            ->join('procedures as p', 'a.service_id', '=', 'p.id')
            ->select('p.name', DB::raw('count(*) as total'))
            ->groupBy('p.name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // الإيرادات
        $revenueMonth = Payment::whereDate('payment_date', '>=', $startOfMonth)
            ->sum('amount');
        $revenueTotal = Payment::sum('amount');

        // عدد المستخدمين حسب كل دور


        $usersByRole = Role::withCount('users')->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'patients_today' => $patientsToday,
                'patients_month' => $patientsMonth,
                'total_patients' => $totalPatients,
                'appointments' => $appointments,
                'top_procedures' => $topProcedures,
                'revenue_month' => $revenueMonth,
                'revenue_total' => $revenueTotal,
                'users_by_role' => $usersByRole,
            ],
        ]);
    }
}
