import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Patient } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import img from '@/assets/images/اسنان.jpg';
export default function Show({ patient }: { patient: Patient }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        { title: patient.name, href: route('patients.show', patient.id) },
    ];

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
        </AppLayout>
    );
}
