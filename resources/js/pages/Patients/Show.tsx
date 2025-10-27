import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Patient } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import img from '@/assets/images/اسنان.jpg';
export default function Show({ patient }: { patient: Patient }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        { title: patient.name, href: route('patients.show', patient.id) },
    ];
console.log(patient,'patient');

    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();

    const handleDeleteTooth = (id: number) => {
        if (confirm('هل تريد حذف السن؟')) {
            router.delete(route('tooth.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteProcedure = (id: number) => {
        if (confirm('هل تريد حذف الإجراء؟')) {
            router.delete(route('procedures.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`عرض المريض: ${patient.name}`} />
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    معلومات المريض
                </h1>

                <div className="space-y-4">
                    <img src={img} alt=''/>
                    <div className="flex justify-between border-b py-2">
                        <span className="font-semibold text-gray-600">الاسم الكامل:</span>
                        <span className="text-gray-800">{patient.name}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span className="font-semibold text-gray-600">البريد الإلكتروني:</span>
                        <span className="text-gray-800">{patient.email || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span className="font-semibold text-gray-600">رقم الهاتف:</span>
                        <span className="text-gray-800">{patient.phone || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span className="font-semibold text-gray-600">تاريخ الميلاد:</span>
                        <span className="text-gray-800">{patient.birth_date || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span className="font-semibold text-gray-600">الجنس:</span>
                        <span className="text-gray-800">{patient.gender === 'male' ? 'ذكر' : patient.gender === 'female' ? 'أنثى' : '-'}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span className="font-semibold text-gray-600">العنوان:</span>
                        <span className="text-gray-800">{patient.address || '-'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="font-semibold text-gray-600">ملاحظات:</span>
                        <span className="text-gray-800">{patient.notes || '-'}</span>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">الأسنان</h2>
                    <Link href={route('tooth.create', { patient_id: patient.id })} className="inline-block rounded bg-blue-500 px-4 py-2 text-white">
                        إضافة سن
                    </Link>
                </div>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">رقم السن</th>
                            <th className="border px-2 py-1">الحالة</th>
                            <th className="border px-2 py-1">ملاحظات</th>
                            <th className="border px-2 py-1">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patient.teeth.map((tooth, i) => (
                            <tr key={tooth.id}>
                                <td className="border px-2 py-1">{i + 1}</td>
                                <td className="border px-2 py-1">{tooth.tooth_number}</td>
                                <td className="border px-2 py-1">{tooth.status}</td>
                                <td className="border px-2 py-1">{tooth.notes}</td>
                                <td className="border px-2 py-1">
                                    <Link href={route('tooth.edit', tooth.id)} className="mr-2 rounded bg-green-500 px-2 py-1 text-white">
                                        تعديل
                                    </Link>
                                    <button onClick={() => handleDeleteTooth(tooth.id)} className="rounded bg-red-500 px-2 py-1 text-white">
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">الإجراءات</h2>
                    <Link href={route('procedures.create', { patient_id: patient.id })} className="inline-block rounded bg-blue-500 px-4 py-2 text-white">
                        إضافة إجراء
                    </Link>
                </div>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">الاسم</th>
                            <th className="border px-2 py-1">الوصف</th>
                            <th className="border px-2 py-1">التكلفة</th>
                            <th className="border px-2 py-1">المدة (بالدقائق)</th>
                            <th className="border px-2 py-1">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patient.procedures.map((procedure, i) => (
                            <tr key={procedure.id}>
                                <td className="border px-2 py-1">{i + 1}</td>
                                <td className="border px-2 py-1">{procedure.name}</td>
                                <td className="border px-2 py-1">{procedure.description}</td>
                                <td className="border px-2 py-1">{procedure.cost}</td>
                                <td className="border px-2 py-1">{procedure.duration_minutes}</td>
                                <td className="border px-2 py-1">
                                    <Link href={route('procedures.edit', procedure.id)} className="mr-2 rounded bg-green-500 px-2 py-1 text-white">
                                        تعديل
                                    </Link>
                                    <button onClick={() => handleDeleteProcedure(procedure.id)} className="rounded bg-red-500 px-2 py-1 text-white">
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
