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
                        {medicalRecord.images && medicalRecord.images.length > 0 && (
                            <div>
                                <h3 className="font-semibold">Images:</h3>
                                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {medicalRecord.images.map((image, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg">
                                            <img
                                                src={`/storage/${image}`}
                                                alt={`Image ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {medicalRecord.attachments && medicalRecord.attachments.length > 0 && (
                            <div>
                                <h3 className="font-semibold">Attachments:</h3>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                    {medicalRecord.attachments.map((attachment, index) => (
                                        <li key={index}>
                                            <a
                                                href={`/storage/${attachment}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Attachment {index + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {/* Add other fields as needed */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
