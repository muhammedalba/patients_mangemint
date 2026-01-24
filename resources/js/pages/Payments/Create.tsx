import { BreadcrumbItem, PageProps, Patient } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import { useAppToast } from '@/utils/toast';
import {
  User,
  CreditCard,
  CalendarDays,
  FileText,
} from 'lucide-react';


interface CreateProps extends PageProps {
    patients: Patient[];
    patientId?: number;
}

export default function CreatePayment() {
    const { patients, patientId } = usePage<CreateProps>().props;

    const { data, setData, post, errors, processing } = useForm({
        patient_id: patientId ? patientId.toString() : '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        paid_at: '',
        notes: '',
    });

    const [selectedPatientName, setSelectedPatientName] = useState('');
    const [, setSelectedPatientId] = useState<number | null>(patientId ?? null);

    const { success, error } = useAppToast();

    useEffect(() => {
        if (patients.length === 1) {
            const patient = patients[0];
            setSelectedPatientId(patient.id);
            setSelectedPatientName(patient.name);
            setData('patient_id', patient.id.toString());
        }
    }, [patients, setData]);

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatientId(patient.id);
        setSelectedPatientName(patient.name);
        setData('patient_id', patient.id.toString());
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(route('payments.store'), {
            onSuccess: () => {
                success(
                    'تم حفظ الدفعة بنجاح',
                    'تمت إضافة الدفعة إلى سجل المدفوعات'
                );
            },
            onError: () => {
                error(
                    'فشل حفظ الدفعة',
                    errors ? 'يرجى التحقق من البيانات المدخلة.' : 'حدث خطأ غير متوقع.'
                );
            },
        });
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الدفعات', href: route('payments.index') },
        { title: 'إضافة دفعة', href: route('payments.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة دفعة" />

            <div className="mx-auto mt-6 max-w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        إضافة دفعة جديدة
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        تسجيل دفعة لمريض داخل النظام
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Patient */}
                        <SearchInput
                            label="المريض"
                            name="patient_id"
                            value={selectedPatientName}
                            onChange={setSelectedPatientName}
                            options={patients}
                            onSelect={handlePatientSelect}
                            icon={User}
                            error={errors.patient_id}
                        />

                        {/* Amount */}
                        <FormInput
                            label="قيمة الدفعة"
                            name="amount"
                            value={data.amount}
                            onChange={(val) => setData('amount', val)}
                            placeholder="مثال: 150 €"
                            error={errors.amount}
                            icon={CreditCard}
                        />

                        {/* Date */}
                        <FormInput
                            label="تاريخ الدفعة"
                            name="payment_date"
                            type="date"
                            value={data.payment_date}
                            onChange={(val) => setData('payment_date', val)}
                            error={errors.payment_date}
                            icon={CalendarDays}
                        />

                        {/* Notes */}
                        <FormInput
                            label="ملاحظات"
                            name="notes"
                            value={data.notes}
                            onChange={(val) => setData('notes', val)}
                            placeholder="ملاحظات إضافية (اختياري)"
                            error={errors.notes}
                            icon={FileText}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route('payments.index')}
                            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            إلغاء
                        </Link>

                        <FormButton
                            processing={processing}
                            label="حفظ الدفعة"
                            loadingLabel="جارِ الحفظ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

