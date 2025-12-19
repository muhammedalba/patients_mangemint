import DentalChartPage from '@/components/DentalChartPage';
import { DynamicTable } from '@/components/DynamicTable';
import AppLayout from '@/layouts/app-layout';
import { Tooth, type BreadcrumbItem, type Patient } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Show({
    patient,
    tooth,
}: {
    patient: Patient;
    tooth: any;
}) {
    console.log(patient, 'patient');
    console.log(tooth, 'tooth');

    const handleToothClick = (toothId: number) => {
        router.get(
            route('patients.details', { patient: patient.id, tooth: toothId }),
        );
    };

    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();

    const [selectedToothId, setSelectedToothId] = useState<number | null>(
        tooth ? tooth.id : null,
    );

    const handleDeleteTooth = (id: number) => {
        if (confirm('هل تريد حذف السن؟')) {
            router.delete(route('teeth.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const columns: ColumnDef<Tooth>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        {
            id: 'tooth_number',
            accessorKey: 'tooth_number',
            header: 'رقم السن',
        },
        { id: 'status', accessorKey: 'status', header: 'حالة السن' },
        { id: 'notes', accessorKey: 'notes', header: 'ملاحظات ' },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        { title: 'تفاصيل المريض', href: route('patients.details', patient.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تفاصيل المريض : ${patient.name}`} />
            <div className="flex w-full items-start gap-2">
                <div
                    className="mt-2 mr-2 h-auto w-1/4 rounded-lg border bg-white p-4 shadow"
                    dir="rtl"
                >
                    <h2 className="mb-4 text-center text-xl font-bold text-blue-500">
                        بيانات المريض
                    </h2>
                    <div className="grid grid-cols-1 gap-6 text-right text-gray-700">
                        <div>
                            <p className="font-semibold">الاسم</p>
                            <p>{patient.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold">رقم الهاتف</p>
                            <p>{patient.phone}</p>
                        </div>
                        <div>
                            <p className="font-semibold">الجنس</p>
                            <p>{patient.gender}</p>
                        </div>
                        <div>
                            <p className="font-semibold">تاريخ الميلاد</p>
                            <p>{patient.birth_date}</p>
                        </div>
                        <div>
                            <p className="font-semibold">العنوان</p>
                            <p>{patient.address}</p>
                        </div>
                        <div>
                            <p className="font-semibold">العمر</p>
                            <p>
                                {patient.birth_date
                                    ? new Date().getFullYear() -
                                      new Date(patient.birth_date).getFullYear()
                                    : ''}{' '}
                                سنة
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-2 ml-2 w-3/4 rounded-lg border shadow">
                    <DentalChartPage teeth={tooth} patient={patient} />
                </div>
            </div>

            <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-gray-100 bg-white p-6">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold text-gray-600">
                        الأسنان
                    </h2>
                    <Link
                        href={route('teeth.create', { patient_id: patient.id })}
                        className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                    >
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
                        {patient?.teeth?.map((tooth, i) => (
                            <tr
                                key={tooth.id}
                                className={
                                    selectedToothId === tooth.id
                                        ? 'bg-blue-100'
                                        : ''
                                }
                            >
                                <td className="border px-2 py-1">{i + 1}</td>
                                <td className="border px-2 py-1">
                                    {tooth.tooth_number}
                                </td>
                                <td className="border px-2 py-1">
                                    {tooth.status}
                                </td>
                                <td className="border px-2 py-1">
                                    {tooth.notes}
                                </td>
                                <td className="border px-2 py-1">
                                    <Link
                                        href={route('teeth.edit', tooth.id)}
                                        className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                    >
                                        تعديل
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDeleteTooth(tooth.id)
                                        }
                                        className="rounded bg-red-500 px-2 py-1 text-white"
                                    >
                                        حذف
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleToothClick(tooth.id)
                                        }
                                        className="rounded bg-blue-500 px-2 py-1 text-white"
                                    >
                                        عرض الإجراءات
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
