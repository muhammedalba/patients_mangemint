import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Patient, User } from '@/types';
import { route } from 'ziggy-js';
import MedicalRecordForm from './Partials/MedicalRecordForm';
import { Head } from '@inertiajs/react';

export default function Create({
    patients,
    doctors,
}: PageProps<{ patients: Patient[]; doctors: User[] }>) {
console.log(patients,'patients');
console.log(doctors,'doctors');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'السجلات الطبية', href: route('medical-records.index') },
        { title: 'إضافة سجل طبي ', href: route('medical-records.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة سجل طبي" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                                إنشاء سجل طبي جديد
                            </h1>

                    <div className="mt-6 space-y-4">
                        <MedicalRecordForm
                            patients={patients}
                            doctors={doctors}
                            submitLabel="إنشاء سجل"
                        />
                    </div>
                    </div>
        </AppLayout>
    );
}

