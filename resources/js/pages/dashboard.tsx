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
    const { stats } = usePage().props as any;
    console.log(stats);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="لوحة التحكم" />

            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl bg-gray-100 p-4 lg:p-8">
                {/* البطاقات الأساسية */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card title="المرضى اليوم" value={stats.patients_today} />
                    <Card
                        title="المرضى هذا الشهر"
                        value={stats.patients_month}
                    />
                    <Card title="إجمالي المرضى" value={stats.total_patients} />
                </div>

                {/* الإيرادات و المصروفات */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card
                        title="إيرادات الشهر"
                        value={`$${stats.revenue_month}`}
                    />
                    <Card
                        title="إجمالي الإيرادات"
                        value={`$${stats.revenue_total}`}
                    />
                    <Card
                        title="مصروفات الشهر"
                        value={`$${stats.expenses_month ?? 0}`}
                    />
                </div>

                {/* صافي الربح/الخسارة هذا الشهر */}
                <div className="mt-4 grid gap-6 md:grid-cols-1">
                    <Card
                        title="صافي الربح (الشهر)"
                        value={`$${stats.net_profit_month ?? 0}`}
                    />
                </div>

                {/* المواعيد حسب الحالة */}
                <StatsList
                    title="المواعيد حسب الحالة"
                    items={stats.appointments}
                    labelKey="status"
                    valueKey="total"
                />

                {/* مواعيد اليوم */}
                <AppointmentsToday
                    title="مواعيد اليوم"
                    appointments={stats.appointmentsToday}
                />

                {/* أكثر الإجراءات طلبًا */}
                <StatsList
                    title="أكثر الإجراءات طلبًا"
                    items={stats.top_procedures}
                    labelKey="name"
                    valueKey="total"
                />

                {/* أكثر فئات المصروفات لهذا الشهر */}
                <StatsList
                    title="أكبر فئات المصروفات هذا الشهر"
                    items={stats.top_expense_categories || []}
                    labelKey="category_name"
                    valueKey="total"
                />
                {/* المستخدمون حسب الدور */}
                <StatsList
                    title="عدد المستخدمين حسب الدور"
                    items={stats.users_by_role}
                    labelKey="name"
                    valueKey="users_count"
                />

                {/* عدد الأطباء */}
                <Card title="عدد الأطباء" value={stats.doctors_count} />
            </div>
        </AppLayout>
    );
}

/* بطاقة */
function Card({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="flex flex-col justify-between rounded-lg border border-gray-300 bg-white p-4 shadow transition-shadow hover:shadow-lg">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="mt-2 text-xl font-bold text-gray-800">{value}</p>
        </div>
    );
}

/* قائمة إحصائيات */
function StatsList({
    title,
    items,
    labelKey,
    valueKey,
}: {
    title: string;
    items: any[];
    labelKey: string;
    valueKey: string;
}) {
    return (
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow">
            <h3 className="mb-2 text-lg font-medium text-gray-700">{title}</h3>
            <ul className="list-inside list-disc text-gray-700">
                {items.map((item) => (
                    <li key={item[labelKey]} className="capitalize">
                        {item[labelKey]}: {item[valueKey]}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* جدول مواعيد اليوم */
function AppointmentsToday({
    title,
    appointments,
}: {
    title: string;
    appointments: any[];
}) {
    return (
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow">
            <h3 className="mb-2 text-lg font-medium text-gray-700">{title}</h3>

            {appointments?.length === 0 ? (
                <p className="text-gray-500">لا توجد مواعيد اليوم</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-3 py-2 text-right">
                                الوقت
                            </th>
                            <th className="border px-3 py-2 text-right">
                                المريض
                            </th>
                            <th className="border px-3 py-2 text-right">
                                الطبيب
                            </th>
                            <th className="border px-3 py-2 text-right">
                                الخدمة
                            </th>
                            <th className="border px-3 py-2 text-right">
                                الحالة
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((a) => (
                            <tr key={a.id} className="even:bg-gray-50">
                                <td className="border px-3 py-2">
                                    {a.start_time} – {a.end_time}
                                </td>
                                <td className="border px-3 py-2">
                                    {a.patient?.name}
                                </td>
                                <td className="border px-3 py-2">
                                    {a.doctor?.name}
                                </td>
                                <td className="border px-3 py-2">
                                    {a.service?.name}
                                </td>
                                <td className="border px-3 py-2 capitalize">
                                    {a.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
