import DentalChartPage from '@/components/DentalChartPage';
import DiscountForm from '@/components/DiscountForm';
import DownloadInvoice from '@/components/DownloadInvoice';
import { DynamicTable } from '@/components/DynamicTable';
import FinancialSummary from '@/components/FinancialSummary';
import AppLayout from '@/layouts/app-layout';
import { Tooth, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Show(
    {
        // patient,
        // patientDetails,
        // services_category,
    }: {
        // patient: Patient;
        // patientDetails: any;
        // services_category: ServiceCategory[];
    },
) {
    const { services_category, patientDetails, flash } = usePage<any>().props;
    const [openProcedures, setOpenProcedures] = useState(false);
    const [openSummary, setOpenSummary] = useState(false);
    const [openDiscount, setOpenDiscount] = useState(false);

    console.log(patientDetails, 'patientDetails');
    console.log(services_category, 'servicesCategory');

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

    const columnsProcedures = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'name', accessorKey: 'name', header: 'اسم الإجراء' },
        {
            id: 'processing_date',
            accessorKey: 'processing_date',
            header: 'تاريخ التنفيذ',
            cell: ({ row }) =>
                new Date(row.original.processing_date).toLocaleDateString(
                    'en-SY',
                ),
        },
        { id: 'cost', accessorKey: 'cost', header: 'التكلفة' },
        { id: 'tooth_number', accessorKey: 'tooth_number', header: 'رقم السن' },
    ];

    console.log(patientDetails.procedures);
    console.log(patientDetails.financial_summary);
    console.log(patientDetails.payments);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        {
            title: 'تفاصيل المريض',
            href: route('patients.details', patientDetails?.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تفاصيل المريض : ${patientDetails?.name}`} />
            <div className="w-full gap-2 p-2">
                <div
                    className="mt-2 mr-2 rounded-lg border bg-white p-4 shadow"
                    dir="rtl"
                >
                    <div className="flex flex-row gap-2 rounded-2xl border p-2">
                        <Link
                            className="block w-full rounded-lg border-blue-600 bg-white px-4 py-2 text-center font-semibold transition hover:bg-blue-500"
                            href={`/appointments/create?patient_id=${patientDetails?.id}`}
                        >
                            إضافة موعد
                        </Link>
                        <Link
                            className="block w-full rounded-lg border-red-700 bg-white px-4 py-2 text-center font-semibold transition hover:bg-red-700"
                            href={`/payments/create/${patientDetails?.id}`}
                        >
                            إضافة دفعة
                        </Link>
                        <Link
                            className="block w-full rounded-lg border-green-600 bg-white px-4 py-2 text-center font-semibold transition hover:bg-green-600"
                            href={`/procedures/create/${patientDetails?.id}`}
                        >
                            إضافة إجراء
                        </Link>
                    </div>
                    {/* <h2 className="mb-4 text-center text-xl font-bold text-blue-500">
                        بيانات المريض
                    </h2>
                    <div className="grid grid-cols-1 gap-6 text-right text-gray-700">
                        <div>
                            <p className="font-semibold">الاسم</p>
                            <p>{patientDetails?.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold">رقم الهاتف</p>
                            <p>{patientDetails?.phone}</p>
                        </div>
                        <div>
                            <p className="font-semibold">الجنس</p>
                            <p>{patientDetails?.gender}</p>
                        </div>
                        <div>
                            <p className="font-semibold">تاريخ الميلاد</p>
                            <p>{patientDetails?.birth_date}</p>
                        </div>
                        <div>
                            <p className="font-semibold">العنوان</p>
                            <p>{patientDetails?.address}</p>
                        </div>
                        <div>
                            <p className="font-semibold">العمر</p>
                            <p>
                                {patientDetails?.birth_date
                                    ? new Date().getFullYear() -
                                      new Date(patientDetails?.birth_date).getFullYear()
                                    : ''}{' '}
                                سنة
                            </p>
                        </div>
                    </div> */}
                </div>

                <div>
                    <DentalChartPage
                        patient={patientDetails}
                        services_category={services_category}
                    />
                </div>
                <div className="mt-2 grid grid-cols-1 rounded-lg border shadow md:grid-cols-2 gap-2">
                    <div>
                        <section className="p-2">
                            <button
                                onClick={() =>
                                    setOpenProcedures(!openProcedures)
                                }
                                className="rounded-md bg-green-600 px-4 py-2 text-white"
                            >
                                {openProcedures
                                    ? 'إخفاء الإجراءات'
                                    : 'عرض الإجراءات'}
                            </button>
                            {openProcedures && (
                                <div>
                                    <h1 className="p-4 px-2 font-medium text-gray-700">
                                        {`إجراءات المريض : ${patientDetails?.name}`}
                                    </h1>
                                    <DynamicTable
                                        data={patientDetails.procedures}
                                        columns={columnsProcedures}
                                    />
                                </div>
                            )}
                        </section>
                        <section className="p-2">
                            <button
                                onClick={() => setOpenSummary(!openSummary)}
                                className="rounded-md bg-red-700 px-4 py-2 text-white"
                            >
                                {openSummary
                                    ? 'إخفاء كشف الحساب'
                                    : 'عرض كشف الحساب'}
                            </button>
                            {openSummary && (
                                <div>
                                    <FinancialSummary
                                        summary={
                                            patientDetails.financial_summary
                                        }
                                    />
                                </div>
                            )}
                        </section>
                        <section className="p-2">
                            <button
                                onClick={() => setOpenDiscount(!openDiscount)}
                                className="rounded-md bg-yellow-600 px-4 py-2 text-white"
                            >
                                {openDiscount ? 'إغلاق خصم' : 'إضافة خصم'}
                            </button>
                            {openDiscount && (
                                <DiscountForm patientId={patientDetails.id} />
                            )}
                        </section>

                        <section className="p-2">
                            <DownloadInvoice patientId={patientDetails.id} />
                        </section>
                    </div>
                </div>
            </div>
            {/* <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-gray-100 bg-white p-6">
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

                <section className="p-4">
                    <DynamicTable data={patient.teeth} columns={columns} />
                </section>
            </div> */}

            {/* <table className="w-full border">
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
                                    tooth.id
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
                                        // onClick={() =>
                                        //     handleDeleteTooth(tooth.id)
                                        // }
                                        className="rounded bg-red-500 px-2 py-1 text-white"
                                    >
                                        حذف
                                    </button>
                                    <button
                                        // onClick={() =>
                                        //     handleToothClick(tooth.id)
                                        // }
                                        className="rounded bg-blue-500 px-2 py-1 text-white"
                                    >
                                        عرض الإجراءات
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}
        </AppLayout>
    );
}
