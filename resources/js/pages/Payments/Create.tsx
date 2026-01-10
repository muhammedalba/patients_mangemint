import { BreadcrumbItem, PageProps, Patient } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';

interface CreateProps extends PageProps {
    patients: Patient[];
    patientId?: number;
}

const Create: React.FC<CreateProps> = ({ auth, patients, patientId }) => {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: patientId ? patientId.toString() : '',
        amount: '',
        payment_date: '',
        paid_at: '',
        notes: '',
    });

    const [selectedPatientName, setSelectedPatientName] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
        patientId ?? null,
    );

    useEffect(() => {
        if (patients.length === 1) {
            const patient = patients[0];
            setSelectedPatientId(patient.id);
            setSelectedPatientName(patient.name);
            setData('patient_id', patient.id.toString());
        }
    }, [patients]);

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatientId(patient.id);
        setSelectedPatientName(patient.name);
        setData('patient_id', patient.id.toString());
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('payments.store'));
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الدفعات',
            href: route('payments.index'),
        },
        {
            title: 'إضافة دفعة',
            href: route('payments.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة دفعة " />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-4 text-center text-xl font-bold text-gray-700">
                    إضافة دفعة
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                            label="الدفعة"
                            name="amount"
                            value={data.amount}
                            onChange={(val) => setData('amount', val)}
                            placeholder="ادخل قيمة الدفعة"
                            error={errors.amount}
                        />

                        <FormInput
                            label="تاريخ الدفعة"
                            name="payment_date"
                            type="date"
                            value={data.payment_date}
                            onChange={(val) => setData('payment_date', val)}
                            placeholder="ادخل تاريخ الدفعة"
                            error={errors.payment_date}
                        />

                        <FormInput
                            label="ملاحظات"
                            name="notes"
                            type="text"
                            value={data.notes}
                            onChange={(val) => setData('notes', val)}
                            placeholder="ملاحظات"
                            error={errors.notes}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('payments.index')}
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
};

export default Create;
