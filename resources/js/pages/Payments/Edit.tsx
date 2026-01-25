import {
    BreadcrumbItem,
    PageProps,
    Patient,
    Payment,
} from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

import AppLayout from '@/layouts/app-layout';
import { FormInput } from '@/components/FormInput';
import { SearchInput } from '@/components/SearchInput';
import { FormButton } from '@/components/FormButton';
import { useAppToast } from '@/utils/toast';

import {
    User,
    CreditCard,
    CalendarDays,
    FileText,
} from 'lucide-react';

interface EditProps extends PageProps {
    payment: Payment;
    patients: Patient[];
}

const Edit: React.FC<EditProps> = ({ payment, patients }) => {
    const { data, setData, put, errors, processing } = useForm({
        ...payment,
        patient_id: String(payment.patient_id),
    });

    const { success, error, warning } = useAppToast();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!data.patient_id || !data.amount || !data.payment_date) {
            warning('يرجى إدخال جميع الحقول');
            return;
        }

        put(route('payments.update', payment.id), {
            onSuccess: () => {
                success('تم تعديل  بنجاح', 'تم تعديل الدفعة بنجاح');
            },
            onError: () => {
                error(
                    'فشل تعديل الدفعة',
                    errors ? 'يرجى التحقق من البيانات المدخلة' : 'حدث خطأ غير متوقع.'
                );
            },
        });
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الدفعات', href: route('payments.index') },
        {
            title: 'تعديل الدفعة',
            href: route('payments.edit', payment.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل الدفعة" />

            <div className="mx-auto mt-6 max-w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        تعديل الدفعة
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        تحديث بيانات الدفعة المسجلة للمريض
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Patient */}
                        <SearchInput
                            label="المريض"
                            name="patient_id"
                            value={
                                patients.find(
                                    (p) =>
                                        p.id ===
                                        Number(data.patient_id),
                                )?.name ?? ''
                            }
                            onChange={(val) =>
                                setData('patient_id', val)
                            }
                            options={patients}
                            onSelect={(patient) =>
                                setData(
                                    'patient_id',
                                    patient.id.toString(),
                                )
                            }
                            placeholder="ابحث باسم المريض..."
                            icon={User}
                            error={errors.patient_id}
                        />

                        {/* Amount */}
                        <FormInput
                            label="قيمة الدفعة"
                            name="amount"
                            type="number"
                            value={data.amount.toString()}
                            onChange={(val) =>
                                setData('amount', Number(val))
                            }
                            placeholder="مثال: 150 €"
                            icon={CreditCard}
                            error={errors.amount}
                        />

                        {/* Date */}
                        <FormInput
                            label="تاريخ الدفعة"
                            name="payment_date"
                            type="date"
                            value={data.payment_date}
                            onChange={(val) =>
                                setData('payment_date', val)
                            }
                            icon={CalendarDays}
                            error={errors.payment_date}
                        />

                        {/* Notes */}
                        <FormInput
                            label="ملاحظات"
                            name="notes"
                            type="text"
                            value={data.notes}
                            onChange={(val) =>
                                setData('notes', val)
                            }
                            placeholder="ملاحظات إضافية (اختياري)"
                            icon={FileText}
                            error={errors.notes}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route('payments.index')}
                            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            إلغاء
                        </Link>

                        <FormButton
                            processing={processing}
                            label="تحديث الدفعة"
                            loadingLabel="جارِ التحديث..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;
