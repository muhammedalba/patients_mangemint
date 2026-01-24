import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    Heart,
    Shield,
    Sparkles,
    Star,
    Stethoscope,
    TrendingUp,
    UserPlus,
    Users,
    Wallet,
    XCircle,
} from 'lucide-react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard().url,
    },
];

// Custom Tooth Icon Component
function ToothIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2C9.5 2 7.5 3.5 7 6c-.3 1.5-.5 3.5-.5 5.5 0 3 .5 5.5 1 7.5.5 2 1 3 2 3s1.5-1 2-2.5c.3-1 .5-1.5 .5-1.5s.2.5.5 1.5c.5 1.5 1 2.5 2 2.5s1.5-1 2-3c.5-2 1-4.5 1-7.5 0-2-.2-4-.5-5.5C16.5 3.5 14.5 2 12 2z" />
        </svg>
    );
}

// Dental Chair Icon
function DentalChairIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 20h2l1-4h10l1 4h2M7 16l1-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2l1 6M12 8V4M9 4h6" />
        </svg>
    );
}

export default function Dashboard() {
    const { stats } = usePage().props as any;
    console.log(stats);

    const dateStr = useMemo(() => {
        return new Date().toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, []);

    const timeStr = useMemo(() => {
        return new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="لوحة التحكم" />

            <div
                className="flex min-h-screen flex-1 flex-col gap-6 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20 p-6 pt-4 font-sans"
                dir="rtl"
            >
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-teal-600 via-cyan-600 to-blue-600 p-6 text-white shadow-xl shadow-cyan-500/20">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-10">
                            <ToothIcon className="h-20 w-20" />
                        </div>
                        <div className="absolute bottom-4 left-20">
                            <ToothIcon className="h-16 w-16" />
                        </div>
                        <div className="absolute top-1/2 left-1/3">
                            <Sparkles className="h-12 w-12" />
                        </div>
                    </div>

                    <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 ring-2 ring-white/30 backdrop-blur-sm">
                                <ToothIcon className="h-9 w-9 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                    مركز زيركون لطب الأسنان
                                </h1>
                                <p className="mt-1 text-sm text-cyan-100 md:text-base">
                                    ابتسامة مشرقة تبدأ من هنا ✨
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-sm">
                            <Calendar className="h-5 w-5 text-cyan-200" />
                            <div className="text-sm">
                                <p className="text-cyan-100">التاريخ والوقت</p>
                                <p className="font-semibold">{dateStr}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="المرضى الجدد اليوم"
                        value={stats.patients_today}
                        icon={UserPlus}
                        subtitle="مريض جديد"
                        gradient="from-blue-500 to-cyan-500"
                        bgGradient="from-blue-50 to-cyan-50"
                        iconBg="bg-blue-500"
                    />
                    <MetricCard
                        title="مواعيد اليوم"
                        value={stats.appointmentsToday?.length || 0}
                        icon={DentalChairIcon}
                        subtitle="جلسة علاجية"
                        gradient="from-violet-500 to-purple-500"
                        bgGradient="from-violet-50 to-purple-50"
                        iconBg="bg-violet-500"
                    />
                    <MetricCard
                        title="إيرادات الشهر"
                        value={`${Number(stats.revenue_month).toLocaleString()}`}
                        currency="$"
                        icon={Wallet}
                        subtitle="+12% من الشهر السابق"
                        trend="up"
                        gradient="from-emerald-500 to-teal-500"
                        bgGradient="from-emerald-50 to-teal-50"
                        iconBg="bg-emerald-500"
                    />
                    <MetricCard
                        title="صافي الأرباح"
                        value={`${Number(stats.net_profit_month ?? 0).toLocaleString()}`}
                        currency="$"
                        icon={TrendingUp}
                        subtitle="أداء ممتاز"
                        trend="up"
                        gradient="from-amber-500 to-orange-500"
                        bgGradient="from-amber-50 to-orange-50"
                        iconBg="bg-amber-500"
                    />
                </div>

                {/* Secondary Stats Row */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MiniStatCard
                        label="إجمالي المرضى"
                        value={stats.total_patients}
                        icon={Users}
                        color="cyan"
                    />
                    <MiniStatCard
                        label="أطباء الأسنان"
                        value={stats.doctors_count}
                        icon={Stethoscope}
                        color="teal"
                    />
                    <MiniStatCard
                        label="معدل الرضا"
                        value="98%"
                        icon={Heart}
                        color="rose"
                    />
                    <MiniStatCard
                        label="الجلسات المكتملة"
                        value={stats.completed_appointments || 156}
                        icon={CheckCircle2}
                        color="emerald"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Appointments Section - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="h-full rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm shadow-slate-200/50">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">
                                            جدول المواعيد اليوم
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            جلسات العلاج والفحص المجدولة
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="border-0 bg-cyan-100 px-3 py-1 text-cyan-700 hover:bg-cyan-100">
                                        {stats.appointmentsToday?.length || 0}{' '}
                                        مواعيد
                                    </Badge>
                                </div>
                            </div>

                            <AppointmentsTable
                                appointments={stats.appointmentsToday}
                            />
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="flex flex-col gap-6">
                        {/* Top Procedures Card */}
                        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm shadow-slate-200/50">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30">
                                    <ToothIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">
                                        العلاجات الأكثر طلباً
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        هذا الشهر
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {stats.top_procedures?.map(
                                    (proc: any, i: number) => (
                                        <ProcedureItem
                                            key={i}
                                            name={proc.name}
                                            count={proc.total}
                                            max={stats.top_procedures[0].total}
                                            rank={i + 1}
                                        />
                                    ),
                                )}
                                {(!stats.top_procedures ||
                                    stats.top_procedures.length === 0) && (
                                    <EmptyState
                                        message="لا توجد بيانات للإجراءات"
                                        small
                                    />
                                )}
                            </div>
                        </div>

                        {/* Expense Categories */}
                        {stats.top_expense_categories &&
                            stats.top_expense_categories.length > 0 && (
                                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm shadow-slate-200/50">
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">
                                                توزيع المصروفات
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                هذا الشهر
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {stats.top_expense_categories.map(
                                            (cat: any, i: number) => (
                                                <ExpenseItem
                                                    key={i}
                                                    name={cat.category_name}
                                                    amount={cat.total}
                                                    totalExpense={
                                                        stats.expenses_month
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-l from-slate-50 to-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-center gap-8 text-center">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-cyan-600" />
                            <span className="text-sm text-slate-600">
                                نظام آمن ومحمي
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Star className="h-5 w-5 text-amber-500" />
                            <span className="text-sm text-slate-600">
                                خدمة عملاء متميزة
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-violet-500" />
                            <span className="text-sm text-slate-600">
                                تقنيات حديثة
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// --- Premium Components ---

function MetricCard({
    title,
    value,
    currency,
    icon: Icon,
    subtitle,
    trend,
    gradient,
    bgGradient,
    iconBg,
}: any) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                bgGradient,
            )}
        >
            {/* Background decoration */}
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/30 blur-2xl" />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg',
                            iconBg,
                        )}
                    >
                        {typeof Icon === 'function' ? (
                            <Icon className="h-6 w-6" />
                        ) : (
                            <Icon className="h-6 w-6" />
                        )}
                    </div>
                    {trend && (
                        <div
                            className={cn(
                                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                                trend === 'up'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-700',
                            )}
                        >
                            {trend === 'up' ? (
                                <ArrowUpRight className="h-3 w-3" />
                            ) : (
                                <ArrowDownRight className="h-3 w-3" />
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-slate-600">
                        {title}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                        {currency && (
                            <span className="text-lg text-slate-500">
                                {currency}
                            </span>
                        )}
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-2 text-xs text-slate-500">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function MiniStatCard({ label, value, icon: Icon, color }: any) {
    const colorMap: Record<string, { bg: string; icon: string; text: string }> =
        {
            cyan: {
                bg: 'bg-cyan-50',
                icon: 'bg-cyan-500',
                text: 'text-cyan-600',
            },
            teal: {
                bg: 'bg-teal-50',
                icon: 'bg-teal-500',
                text: 'text-teal-600',
            },
            rose: {
                bg: 'bg-rose-50',
                icon: 'bg-rose-500',
                text: 'text-rose-600',
            },
            emerald: {
                bg: 'bg-emerald-50',
                icon: 'bg-emerald-500',
                text: 'text-emerald-600',
            },
        };

    const colors = colorMap[color] || colorMap.cyan;

    return (
        <div
            className={cn(
                'flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 transition-all hover:shadow-md',
            )}
        >
            <div
                className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white',
                    colors.icon,
                )}
            >
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
            </div>
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
                <TableHeader className="bg-gradient-to-l from-slate-50 to-slate-100/50">
                    <TableRow className="border-b border-slate-200 hover:bg-transparent">
                        <TableHead className="py-4 text-right font-semibold text-slate-700">
                            المريض
                        </TableHead>
                        <TableHead className="py-4 text-right font-semibold text-slate-700">
                            موعد الجلسة
                        </TableHead>
                        <TableHead className="py-4 text-right font-semibold text-slate-700">
                            طبيب الأسنان
                        </TableHead>
                        <TableHead className="py-4 text-right font-semibold text-slate-700">
                            الحالة
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((app, index) => (
                        <TableRow
                            key={app.id}
                            className={cn(
                                'transition-colors hover:bg-cyan-50/50',
                                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30',
                            )}
                        >
                            <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 text-sm font-bold text-white shadow-md">
                                            {(app.patient?.name || 'م').charAt(
                                                0,
                                            )}
                                        </div>
                                        <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-800">
                                            {app.patient?.name}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <ToothIcon className="h-3 w-3" />
                                            {app.service?.name}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span className="font-medium text-slate-700 tabular-nums">
                                        {app.start_time}
                                    </span>
                                    <span className="text-slate-400">-</span>
                                    <span className="font-medium text-slate-700 tabular-nums">
                                        {app.end_time}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
                                        <Stethoscope className="h-3.5 w-3.5 text-violet-600" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">
                                        د. {app.doctor?.name}
                                    </span>
                                </div>
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
    const percentage = Math.min(100, Math.max(8, (count / max) * 100));

    const colors = [
        'from-cyan-500 to-teal-500',
        'from-violet-500 to-purple-500',
        'from-amber-500 to-orange-500',
        'from-rose-500 to-pink-500',
        'from-emerald-500 to-green-500',
    ];

    return (
        <div className="group">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white',
                            colors[rank - 1] || colors[0],
                        )}
                    >
                        {rank}
                    </span>
                    <span className="text-sm font-medium text-slate-700 transition-colors group-hover:text-cyan-600">
                        {name}
                    </span>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                    {count}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className={cn(
                        'h-full rounded-full bg-gradient-to-l transition-all duration-500',
                        colors[rank - 1] || colors[0],
                    )}
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
            <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-slate-600">{name}</span>
                <span className="text-sm font-bold text-slate-800">
                    ${Number(amount).toLocaleString()}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="w-10 text-left text-xs font-medium text-slate-400 tabular-nums">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { icon: any; style: string; label: string }> =
        {
            confirmed: {
                icon: CheckCircle2,
                style: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100',
                label: 'مؤكد',
            },
            completed: {
                icon: CheckCircle2,
                style: 'bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100',
                label: 'مكتمل',
            },
            cancelled: {
                icon: XCircle,
                style: 'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100',
                label: 'ملغى',
            },
            pending: {
                icon: Clock,
                style: 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100',
                label: 'في الانتظار',
            },
            'checked-in': {
                icon: Activity,
                style: 'bg-violet-50 text-violet-700 border-violet-200 shadow-violet-100',
                label: 'حضر',
            },
        };

    const {
        icon: Icon,
        style,
        label,
    } = config[status] || {
        icon: AlertCircle,
        style: 'bg-slate-50 text-slate-700 border-slate-200',
        label: status,
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                'gap-1.5 border py-1.5 pr-2 pl-3 font-medium shadow-sm transition-all hover:shadow-md',
                style,
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </Badge>
    );
}

function EmptyState({ message, small }: { message: string; small?: boolean }) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50/30 text-center',
                small ? 'py-8' : 'py-12',
            )}
        >
            <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200">
                <ToothIcon
                    className={cn(
                        'text-slate-400',
                        small ? 'h-5 w-5' : 'h-6 w-6',
                    )}
                />
            </div>
            <p className="text-sm font-medium text-slate-500">{message}</p>
        </div>
    );
}
