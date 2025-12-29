import DentalChartPage from '@/components/DentalChartPage';
import { DynamicTable } from '@/components/DynamicTable';
import  FormButton  from '@/components/FormButton';
import AppLayout from '@/layouts/app-layout';
import { ServiceCategory, Tooth, type BreadcrumbItem, type Patient } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { route } from 'ziggy-js';

export default function Show({
    patient,
    tooth,
    services_category,
}: {
    patient: Patient;
    tooth: any;
    services_category: ServiceCategory[];
}) {
    console.log(patient, 'patient');
    console.log(tooth, 'tooth');
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
                    <div className='flex flex-col gap-2 border rounded-2xl p-2'>
                        <FormButton className="block w-full text-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition">
                            <a href='/appointments/create'>إضافة موعد</a>
                        </FormButton>
                        <div className="block w-full text-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition">
                            <a href='/payments/create'>إضافة دفعة</a>
                        </div>
                    <div className="block w-full text-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition">
                       <a href='/procedures/create'>إضافة إجراء</a>
                    </div>
                    </div>
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
                    <DentalChartPage patient={patient} services_category={services_category} />
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
        </AppLayout>
    );
}
