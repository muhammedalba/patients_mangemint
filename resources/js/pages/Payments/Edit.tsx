import { BreadcrumbItem, PageProps, Patient, Payment } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { FormInput } from '@/components/FormInput';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { FormButton } from '@/components/FormButton';
import { useAppToast } from '@/utils/toast';

interface EditProps extends PageProps {
    payment: Payment;
    patients: Patient[];
}

const Edit: React.FC<EditProps> = ({ payment, patients }) => {
    const { data, setData, put, errors, processing } = useForm({
        ...payment,

        patient_id: String(payment.patient_id),
    });
    const { success, error } = useAppToast();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('payments.update', payment.id), {
            onSuccess: () => {
            success(
                'تم تعديل الدفعة بنجاح',
            );
        },
        onError: () => {
            error(
                'فشل تعديل الدفعة',
                'يرجى التحقق من البيانات المدخلة'
            );
        },
        });
    }
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الدفعات',
            href: route('payments.index'),
        },
        {
            title: 'تعديل الدفعة',
            href: route('payments.edit', payment.id),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل الدفعة" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل الدفعة
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SearchInput
                            label="اسم المريض"
                            name="patient_id"
                            value={
                                patients.find(
                                    (p) => p.id === Number(data.patient_id),
                                )?.name ?? ''
                            }
                            onChange={(val) => setData('patient_id', val)}
                            options={patients}
                            onSelect={(patient) =>
                                setData('patient_id', patient.id.toString())
                            }
                            placeholder="ابحث باسم المريض..."
                            error={errors.patient_id}
                        />

                        <FormInput
                            label=" قيمة الدفعة"
                            name="amount"
                            type="number"
                            value={data.amount.toString()}
                            onChange={(val) => setData('amount', Number(val))}
                            error={errors.amount}
                        />
                        <FormInput
                            label="تاريخ الموعد"
                            name="date"
                            type="date"
                            value={data.payment_date}
                            onChange={(val) => setData('payment_date', val)}
                            error={errors.payment_date}
                        />
                        <FormInput
                            label="الملاحظات"
                            name="notes"
                            type="text"
                            value={data.notes}
                            onChange={(val) => setData('notes', val)}
                            placeholder="الملاحظات"
                            error={errors.notes}
                        />
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('payments.index')}
                            className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                        >
                            إلغاء
                        </Link>
                        <FormButton
                            processing={processing}
                            label="تحديث"
                            loadingLabel="جارِ التحديث ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;
