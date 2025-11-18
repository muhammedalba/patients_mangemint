
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    MedicalRecord,
    PageProps,
    Patient,
    User,
} from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import MedicalRecordForm from './Partials/MedicalRecordForm';

export default function Edit({
    medicalRecord,
    patients,
    doctors,
}: PageProps<{
    medicalRecord: MedicalRecord;
    patients: Patient[];
    doctors: User[];
}>) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Medical Records', href: route('medical-records.index') },
        // {
        //     title: `Record #${medicalRecord.id}`,
        //     href: route('medical-records.show', medicalRecord.id),
        // },
        {
            title: 'Edit',
            href: route('medical-records.edit', medicalRecord.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Medical Record #${medicalRecord.id}`} />

            <section className="mx-auto max-w-5xl p-6 sm:p-8 md:p-10">
                <div className="rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center dark:border-gray-800">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                تعديل السجل الطبي
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                يمكنك تعديل بيانات السجل الطبي كاملة هنا.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <MedicalRecordForm
                            medicalRecord={medicalRecord}
                            patients={patients}
                            doctors={doctors}
                            submitLabel="Update Record"
                        />
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

