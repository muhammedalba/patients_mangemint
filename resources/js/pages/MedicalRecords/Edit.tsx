
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
        { title: 'السجلات الطبية', href: route('medical-records.index') },

        {
            title: 'تعديل السجل الطبي',
            href: route('medical-records.edit', medicalRecord.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل السجل الطبي (${medicalRecord.id})`} />
                <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                        <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                                تعديل السجل الطبي
                            </h1>

                    <div className="mt-6 space-y-4">
                        <MedicalRecordForm
                            medicalRecord={medicalRecord}
                            patients={patients}
                            doctors={doctors}
                            submitLabel="Update Record"
                        />
                    </div>
                </div>
        </AppLayout>
    );
}

