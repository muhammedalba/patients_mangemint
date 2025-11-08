import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MedicalRecord, PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Show({
    medicalRecord,
}: PageProps<{ medicalRecord: MedicalRecord }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Medical Records',
            href: route('medical-records.index'),
        },
        {
            title: medicalRecord.id.toString(),
            href: route('medical-records.show', medicalRecord.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Medical Record #${medicalRecord.id}`} />
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Medical Record Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Patient:</h3>
                            <p>{medicalRecord.patient.name}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Doctor:</h3>
                            <p>{medicalRecord.doctor.name}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Chief Complaint:</h3>
                            <p>{medicalRecord.chief_complaint}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Clinical Notes:</h3>
                            <p>{medicalRecord.clinical_notes}</p>
                        </div>
                        {/* Add other fields as needed */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
