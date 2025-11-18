
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Patient, User } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import MedicalRecordForm from './Partials/MedicalRecordForm';

export default function Create({
    patients,
    doctors,
}: PageProps<{ patients: Patient[]; doctors: User[] }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Medical Records', href: route('medical-records.index') },
        { title: 'Create', href: route('medical-records.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Medical Record" />

            <section className="mx-auto max-w-5xl p-6 sm:p-8 md:p-10">
                <div className="rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center dark:border-gray-800">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                إنشاء سجل طبي جديد
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                أدخل بيانات السجل الطبي الجديد.
                            </p>
                        </div>
                    </div>
                    <div className="p-6 sm:p-8">
                        <MedicalRecordForm
                            patients={patients}
                            doctors={doctors}
                            submitLabel="Create Record"
                        />
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

