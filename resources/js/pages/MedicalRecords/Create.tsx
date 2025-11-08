import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Patient, User } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import MedicalRecordForm from './Partials/Form';

export default function Create({
    patients,
    doctors,
}: PageProps<{ patients: Patient[]; doctors: User[] }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Medical Records',
            href: route('medical-records.index'),
        },
        {
            title: 'Create',
            href: route('medical-records.create'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Medical Record" />
            <div className="p-4">
                <MedicalRecordForm
                    patients={patients}
                    doctors={doctors}
                    submitLabel="Create"
                />
            </div>
        </AppLayout>
    );
}
