import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

export default function Dashboard() {
    const { stats } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 lg:p-8 bg-gray-100">
                {/* البطاقات الأساسية للمرضى */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card title="المرضى اليوم" value={stats.patients_today} />
                    <Card
                        title="المرضى هذا الشهر"
                        value={stats.patients_month}
                    />
                    <Card title="إجمالي المرضى" value={stats.total_patients} />
                </div>

                {/* الإيرادات */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card
                        title="إيرادات الشهر"
                        value={`$${stats.revenue_month}`}
                    />
                    <Card
                        title="إجمالي الإيرادات"
                        value={`$${stats.revenue_total}`}
                    />
                </div>

                {/* المواعيد حسب الحالة */}
                <StatsList
                    title="المواعيد حسب الحالة"
                    items={stats.appointments}
                    labelKey="status"
                    valueKey="total"
                />

                {/* المواعيد اليوم */}
                <AppointmentsToday
                    title="المواعيد اليوم"
                    appointments={stats.appointmentsToday}
                />

                {/* أكثر الإجراءات طلبًا */}
                <StatsList
                    title="أكثر الإجراءات طلبًا"
                    items={stats.top_procedures}
                    labelKey="name"
                    valueKey="total"
                />

                {/* عدد المستخدمين حسب الدور */}
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

/* بطاقة بسيطة */
function Card({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="flex flex-col justify-between rounded-lg border border-gray-300 bg-white p-4 shadow-lg hover:shadow-xl transition-shadow">
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
        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
            <h3 className="mb-2 text-lg font-medium text-gray-700">{title}</h3>
            <ul className="list-inside list-disc text-gray-700">
                {items.map((item: any) => (
                    <li key={item[labelKey]} className="capitalize">
                        {item[labelKey]}: {item[valueKey]}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* جدول المواعيد اليوم */
function AppointmentsToday({
    title,
    appointments,
}: {
    title: string;
    appointments: any[];
}) {
    return (
        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
            <h3 className="mb-2 text-lg font-medium text-gray-700">{title}</h3>
            {appointments?.length === 0 ? (
                <p className="text-gray-500">لا توجد مواعيد اليوم</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-3 py-2 text-left text-gray-600">الوقت</th>
                            <th className="border px-3 py-2 text-left text-gray-600">المريض</th>
                            <th className="border px-3 py-2 text-left text-gray-600">الطبيب</th>
                            <th className="border px-3 py-2 text-left text-gray-600">الخدمة</th>
                            <th className="border px-3 py-2 text-left text-gray-600">الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments?.map((a: any) => (
                            <tr key={a.id} className="even:bg-gray-50">
                                <td className="border px-3 py-2">{a.start_time} - {a.end_time}</td>
                                <td className="border px-3 py-2">{a.patient?.name}</td>
                                <td className="border px-3 py-2">{a.doctor?.name}</td>
                                <td className="border px-3 py-2">{a.service?.name}</td>
                                <td className="border px-3 py-2 capitalize">{a.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
