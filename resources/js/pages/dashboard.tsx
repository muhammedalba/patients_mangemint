import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Heart,
    Stethoscope,
    TrendingUp,
    UserPlus,
    Users,
    Wallet,
} from 'lucide-react';
import { useMemo } from 'react';

// Import dashboard components
import {
    AppointmentsSection,
    DashboardHeader,
    DentalChairIcon,
    ExpenseCategoriesSection,
    FooterStats,
    MetricCard,
    MiniStatCard,
    TopProceduresSection,
} from '@/components/dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { stats } = usePage().props as any;

    // Memoize data
    const appointmentsData = useMemo(() => stats.appointmentsToday || [], [stats.appointmentsToday]);
    const appointmentsCount = useMemo(() => appointmentsData.length, [appointmentsData]);
    const proceduresData = useMemo(() => stats.top_procedures || [], [stats.top_procedures]);
    const maxProcedureCount = useMemo(() => proceduresData[0]?.total || 1, [proceduresData]);
    const expenseCategories = useMemo(() => stats.top_expense_categories || [], [stats.top_expense_categories]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="لوحة التحكم" />

            <div
                className="flex min-h-screen flex-1 flex-col gap-6 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20 p-6 pt-4 font-sans"
                dir="rtl"
            >
                {/* Header Section */}
                <DashboardHeader
                    clinicName="مركز زيركون لطب الأسنان"
                    tagline="ابتسامة مشرقة تبدأ من هنا"
                />

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
                        glowColor="blue"
                    />
                    <MetricCard
                        title="مواعيد اليوم"
                        value={appointmentsCount}
                        icon={DentalChairIcon}
                        subtitle="جلسة علاجية"
                        gradient="from-violet-500 to-purple-500"
                        bgGradient="from-violet-50 to-purple-50"
                        iconBg="bg-violet-500"
                        glowColor="violet"
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
                        glowColor="emerald"
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
                        glowColor="amber"
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
                    {/* Appointments Section */}
                    <AppointmentsSection
                        appointments={appointmentsData}
                        appointmentsCount={appointmentsCount}
                    />

                    {/* Right Sidebar */}
                    <div className="flex flex-col gap-6">
                        <TopProceduresSection
                            procedures={proceduresData}
                            maxCount={maxProcedureCount}
                        />
                        <ExpenseCategoriesSection
                            categories={expenseCategories}
                            totalExpense={stats.expenses_month}
                        />
                    </div>
                </div>

                {/* Footer Stats */}
                <FooterStats />
            </div>
        </AppLayout>
    );
}
