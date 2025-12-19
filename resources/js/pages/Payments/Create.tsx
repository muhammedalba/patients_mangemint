import { AppShell } from '@/components/app-shell';
import { BreadcrumbItem, PageProps, Patient } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import AppLayout from '@/layouts/app-layout';

interface CreateProps extends PageProps {
    patients: Patient[];
}

const Create: React.FC<CreateProps> = ({ auth, patients }) => {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: '',
        amount: '',
        payment_date: '',
        paid_at: '',
        notes: '',
    });
    console.log(errors, 'errors');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(data, 'data ');

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

                    <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <FormInput
                            label="اسم المريض"
                            name="patient_id"
                            value={data.patient_id}
                            onChange={(e) =>
                                setData('patient_id', e.target.value)
                            }
                            placeholder="Enter patient ID"
                            error={errors.patient_id}
                        />

                        <FormInput
                            label="الدفعة"
                            name="amount"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            placeholder="ادخل قيمة الدفعة"
                            error={errors.amount}
                        />

                        <FormInput
                            label="تاريخ الدفعة"
                            name="payment_date"
                            type="date"
                            value={data.payment_date}
                            onChange={(e) =>
                                setData('payment_date', e.target.value)
                            }
                            placeholder="ادخل تاريخ الدفعة"
                            error={errors.payment_date}
                        />

                        <FormInput
                            label="الملاحظات"
                            name="notes"
                            type="text"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="الملاحظات"
                            error={errors.notes}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('patients.index')}
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
