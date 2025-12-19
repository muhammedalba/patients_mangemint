import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { stats } = usePage().props;
    console.log(stats, 'stats');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="لوحة التحكم" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* بطاقات الإحصائيات الأساسية */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border bg-white p-4 shadow dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            المرضى اليوم
                        </h3>
                        <p className="mt-2 text-2xl font-bold">
                            {stats.patients_today}
                        </p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border bg-white p-4 shadow dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            المرضى هذا الشهر
                        </h3>
                        <p className="mt-2 text-2xl font-bold">
                            {stats.patients_month}
                        </p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border bg-white p-4 shadow dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            إجمالي المرضى
                        </h3>
                        <p className="mt-2 text-2xl font-bold">
                            {stats.total_patients}
                        </p>
                    </div>
                </div>

                {/* الإيرادات */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border bg-white p-4 shadow dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            إيرادات الشهر
                        </h3>
                        <p className="mt-2 text-2xl font-bold">
                            ${stats.revenue_month}
                        </p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border bg-white p-4 shadow dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            إجمالي الإيرادات
                        </h3>
                        <p className="mt-2 text-2xl font-bold">
                            ${stats.revenue_total}
                        </p>
                    </div>
                </div>

                {/* المواعيد حسب الحالة */}
                <div className="mt-6 rounded-xl border border-sidebar-border bg-white p-4 shadow dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-2 text-lg font-medium">
                        المواعيد حسب الحالة
                    </h3>
                    <ul className="list-inside list-disc">
                        {stats.appointments.map((a: any) => (
                            <li key={a.status} className="capitalize">
                                {a.status}: {a.total}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* أكثر الإجراءات طلبًا */}
                <div className="mt-6 rounded-xl border border-sidebar-border bg-white p-4 shadow dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-2 text-lg font-medium">
                        أكثر الإجراءات طلبًا
                    </h3>
                    <ul className="list-inside list-disc">
                        {stats.top_procedures.map((p: any) => (
                            <li key={p.name}>
                                {p.name}: {p.total}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* عدد المستخدمين حسب الدور */}
                <div className="mt-6 rounded-xl border border-sidebar-border bg-white p-4 shadow dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-2 text-lg font-medium">
                        عدد المستخدمين حسب الدور
                    </h3>
                    <ul className="list-inside list-disc">
                        {stats.users_by_role.map((u: any) => (
                            <li key={u.id} className="capitalize">
                                {u.name}: {u.users_count}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
