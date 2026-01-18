import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    CreditCard,
    TrendingUp,
    Users,
    UserPlus,
    Activity,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Stethoscope,
    Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { stats } = usePage().props as any;

    const dateStr = useMemo(() => {
        return new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="لوحة التحكم" />

            <div className="flex min-h-screen flex-1 flex-col gap-8 bg-slate-50/50 p-6 pt-2 font-sans">
                {/* Header Section */}
                <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            مركز زيركون الطبي
                        </h1>
                        <p className="mt-1 text-slate-500">
                            أهلاً بك، إليك ملخص أداء العيادة لليوم <span className="font-medium text-slate-700">{dateStr}</span>.
                        </p>
                    </div>
                    {/* Optional: Add a quick action button here if needed */}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <PremiumMetricCard
                        title="المرضى اليوم"
                        value={stats.patients_today}
                        icon={UserPlus}
                        trend="تسجيل جديد"
                        color="blue"
                    />
                    <PremiumMetricCard
                        title="مواعيد اليوم"
                        value={stats.appointmentsToday?.length || 0}
                        icon={Calendar}
                        trend="مجدولة"
                        color="indigo"
                    />
                    <PremiumMetricCard
                        title="إيرادات الشهر"
                        value={`$${Number(stats.revenue_month).toLocaleString()}`}
                        icon={Wallet}
                        trend="+12% عن الشهر الماضي" 
                        trendPositive={true}
                        color="teal"
                    />
                    <PremiumMetricCard
                        title="صافي الربح"
                        value={`$${Number(stats.net_profit_month ?? 0).toLocaleString()}`}
                        icon={TrendingUp}
                        trend="أداء ممتاز"
                        trendPositive={true}
                        color="emerald"
                    />
                </div>

                {/* Main Content Split */}
               
                    
                    

                    {/* Right Column: Stats & Procedures (3/7) */}
                    <div className="flex flex-wrap  gap-6  items-center justify-between">
                        
                        {/* Top Procedures */}
                        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                            <h3 className="mb-4 text-base font-bold text-slate-800 flex items-center gap-2">
                                <Activity className=" text-rose-500" />
                                الإجراءات الأكثر طلباً
                            </h3>
                            <div className="space-y-5">
                                {stats.top_procedures?.map((proc: any, i: number) => (
                                    <ProcedureItem 
                                        key={i} 
                                        name={proc.name} 
                                        count={proc.total} 
                                        max={stats.top_procedures[0].total} // Assuming first is max
                                        rank={i + 1}
                                    />
                                ))}
                                {(!stats.top_procedures || stats.top_procedures.length === 0) && (
                                    <EmptyState message="لا توجد بيانات للإجراءات حتى الآن" />
                                )}
                            </div>
                        </div>

                         {/* Expense Categories */}
                         {stats.top_expense_categories && stats.top_expense_categories.length > 0 && (
                            <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                                <h3 className="mb-4 text-base font-bold text-slate-800 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-amber-500" />
                                    توزيع المصروفات
                                </h3>
                                <div className="space-y-4">
                                    {stats.top_expense_categories.map((cat: any, i: number) => (
                                       <ExpenseItem 
                                            key={i}
                                            name={cat.category_name} 
                                            amount={cat.total}
                                            totalExpense={stats.expenses_month}
                                       />
                                    ))}
                                </div>
                            </div>
                         )}
                         
                         {/* Quick Stats Grid */}
                        
                            <QuickStat 
                                label="إجمالي المرضى" 
                                value={stats.total_patients} 
                                icon={Users} 
                                color="bg-blue-50 text-blue-600 "
                            />
                            <QuickStat 
                                label="الطاقم الطبي" 
                                value={stats.doctors_count} 
                                icon={Stethoscope} 
                                color="bg-cyan-50 text-cyan-600 "
                            />
                        

                    </div>
               
                {/* Appointments (4/7) */}
                    
                <div className="flex flex-col gap-6 lg:col-span-4">
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-indigo-500" />
                                        جدول المواعيد
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        قائمة المواعيد لليوم وحالتها الحالية.
                                    </p>
                                </div>
                                <Badge variant="outline" className="px-3 py-1 text-xs">
                                    {stats.appointmentsToday?.length || 0} مواعيد
                                </Badge>
                            </div>

                            <AppointmentsTable appointments={stats.appointmentsToday} />
                        </div>
                </div>
            </div>
        </AppLayout>
    );
}

// --- Premium Components ---

function PremiumMetricCard({ title, value, icon: Icon, trend, trendPositive, color = "blue" }: any) {
    const colorStyles: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
        teal: "bg-teal-50 text-teal-600 ring-teal-100",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    };
    
    const iconStyles = colorStyles[color] || colorStyles.blue;

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
                <div className={cn("rounded-xl p-3 ring-1", iconStyles)}>
                    <Icon className="h-6 w-6" />
                </div>
                {/* Optional subtle background decoration */}
                <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-5 transition-transform group-hover:scale-110", iconStyles.split(" ")[0])} />
            </div>
            <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            </div>
            {trend && (
                <div className="mt-3 flex items-center text-xs">
                    <span className={cn("font-medium", trendPositive === true ? "text-emerald-600" : trendPositive === false ? "text-rose-600" : "text-slate-400")}>
                        {trend}
                    </span>
                </div>
            )}
        </div>
    );
}

function AppointmentsTable({ appointments }: { appointments: any[] }) {
    if (!appointments || appointments.length === 0) {
        return <EmptyState message="لا توجد مواعيد مجدولة لهذا اليوم" />;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-100">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-right font-semibold text-slate-600">المريض</TableHead>
                        <TableHead className="text-right font-semibold text-slate-600">الوقت</TableHead>
                        <TableHead className="text-right font-semibold text-slate-600">الطبيب</TableHead>
                        <TableHead className="text-right font-semibold text-slate-600">الحالة</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((app) => (
                        <TableRow key={app.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                                        {(app.patient?.name || 'P').charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-800 text-sm">
                                            {app.patient?.name}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            {app.service?.name}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium text-slate-600 tabular-nums">
                                {app.start_time} - {app.end_time}
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">
                                {app.doctor?.name}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={app.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function ProcedureItem({ name, count, max, rank }: any) {
    const percentage = Math.min(100, Math.max(5, (count / max) * 100)); // Min 5% for visual

    return (
        <div className="group">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                        {rank}
                    </span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {name}
                    </span>
                </div>
                <span className="text-xs font-bold text-slate-600">{count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div 
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500 group-hover:bg-indigo-600" 
                    style={{ width: `${percentage}%` }} 
                />
            </div>
        </div>
    );
}

function ExpenseItem({ name, amount, totalExpense }: any) {
    const percentage = Math.min(100, (amount / totalExpense) * 100) || 0;
    
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">{name}</span>
                <span className="text-sm font-bold text-slate-800">${Number(amount).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
                 <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div 
                        className="h-full rounded-full bg-amber-400" 
                        style={{ width: `${percentage}%` }} 
                    />
                </div>
                <span className="text-[10px] text-slate-400 tabular-nums w-8 text-left">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    )
}

function QuickStat({ label, value, icon: Icon, color }: any) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 py-6 shadow-sm ring-1 ring-slate-900/5 text-center transition-all hover:bg-slate-50">
            <div className={cn("mb-3 rounded-full p-2.5", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-slate-800">{value}</span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">{label}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { icon: any, style: string, label: string }> = {
        confirmed: { icon: CheckCircle2, style: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "مؤكد" },
        completed: { icon: CheckCircle2, style: "bg-blue-100 text-blue-700 border-blue-200", label: "مكتمل" },
        cancelled: { icon: XCircle, style: "bg-rose-100 text-rose-700 border-rose-200", label: "ملغى" },
        pending: { icon: Clock, style: "bg-amber-100 text-amber-700 border-amber-200", label: "معلق" },
        'checked-in': { icon: Activity, style: "bg-purple-100 text-purple-700 border-purple-200", label: "حضر" },
    };

    const { icon: Icon, style, label } = config[status] || { icon: AlertCircle, style: "bg-slate-100 text-slate-700", label: status };

    return (
        <Badge variant="outline" className={cn("gap-1.5 py-1 pr-1.5 pl-2.5 font-normal border shadow-sm", style)}>
            <Icon className="h-3.5 w-3.5" />
            {label}
        </Badge>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 py-12 text-center border border-dashed border-slate-200">
            <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200 mb-3">
                <Box className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">{message}</p>
        </div>
    );
}

import { Box } from 'lucide-react'; // For EmptyState icon
