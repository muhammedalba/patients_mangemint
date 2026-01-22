import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Patient } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

export default function CreateTeeth({
    patients,
    patient_id,
}: {
    patients: Patient[];
    patient_id?: number;
}) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        patient_id: string;
        tooth_number: string;
        status: string;
        notes: string;
    }>({
        patient_id: patient_id?.toString() || '',
        tooth_number: '',
        status: '',
        notes: '',
    });
    console.log(patients);
    console.log(patient_id, 'patient_id');
    const [selectedPatientName, setSelectedPatientName] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('teeth.store'), {
            onSuccess: () => reset(),
        });
    };
    const handlePatientSelect = (patient: Patient) => {
        setData('patient_id', patient.id.toString());
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الأسنان', href: route('teeth.index') },
        { title: 'إضافة سن ', href: route('teeth.create') },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة سن" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-4 px-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة سن جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SearchInput
                            label="اسم المريض"
                            name="patient_id"
                            value={selectedPatientName}
                            onChange={(val) => setSelectedPatientName(val)}
                            options={patients}
                            onSelect={handlePatientSelect}
                            placeholder="ابحث باسم المريض..."
                            error={errors.patient_id}
                        />

                        <FormInput
                            label="رقم السن"
                            name="tooth_number"
                            value={data.tooth_number}
                            onChange={(val: string) =>
                                setData('tooth_number', val)
                            }
                            placeholder="رقم السن"
                            error={errors.tooth_number}
                        />

                        <FormInput
                            label="الحالة"
                            name="status"
                            value={data.status}
                            onChange={(val: string) => setData('status', val)}
                            placeholder="الحالة"
                            error={errors.status}
                        />

                        <FormInput
                            label="ملاحظات"
                            name="notes"
                            value={data.notes}
                            onChange={(val: string) => setData('notes', val)}
                            placeholder="ملاحظات"
                            error={errors.notes}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('procedures.index')}
                            className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                        >
                            إنهاء
                        </Link>

                        <FormButton
                            processing={processing}
                            label="حفظ"
                            loadingLabel="جارِ الحفظ ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
