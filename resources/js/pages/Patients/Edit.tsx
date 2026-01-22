import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { Patient, type BreadcrumbItem } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

export default function EditPatient({ patient }: { patient: Patient }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        birth_date: patient.birth_date || '',
        gender: patient.gender || '',
        marital_status: patient.marital_status || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { success, error } = useAppToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        patch(route('patients.update', patient.id), {
            onSuccess: () => {
                success(
                    'تم تعديل بيانات المريض بنجاح',
                );
            },
            onError: () => {
                error('فشل تعديل بيانات المريض', 'يرجى التحقق من البيانات المدخلة');
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        {
            title: `تعديل بيانات المريض: ${patient.name}`,
            href: route('patients.edit', patient.id),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={` تعديل المريض : ${patient.name}`} />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل بيانات المريض
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label=" اسم المريض"
                            name="name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            placeholder="الاسم الإجراء"
                            error={errors.name}
                        />

                        <FormInput
                            label=" تاريخ الميلاد"
                            name="birth_date"
                            type="date"
                            value={data.birth_date}
                            onChange={(val) => setData('birth_date', val)}
                            placeholder="تاريخ الميلاد"
                            error={errors.birth_date}
                        />

                        <FormInput
                            label="رقم الهاتف"
                            name="phone"
                            type="phone"
                            value={data.phone}
                            onChange={(val) => setData('phone', val)}
                            placeholder="رقم الهاتف"
                            error={errors.phone}
                        />

                        <div className="flex justify-between">
                            <FormSelect
                                label="الجنس"
                                name="gender"
                                value={data.gender}
                                onChange={(val) => {
                                    const value = Array.isArray(val)
                                        ? val[0]
                                        : val;
                                    setData('gender', value);
                                }}
                                options={[
                                    { value: 'male', label: 'ذكر' },
                                    { value: 'female', label: 'أنثى' },
                                ]}
                                error={errors.gender}
                            />

                            <FormSelect
                                label="الحالة الاجتماعية"
                                name="marital_status"
                                value={data.marital_status}
                                onChange={(val) => {
                                    const value = Array.isArray(val)
                                        ? val[0]
                                        : val;
                                    setData('marital_status', value);
                                }}
                                options={[
                                    { value: 'single', label: 'عازب' },
                                    { value: 'married', label: 'متزوج' },
                                    { value: 'divorced', label: 'مطلق' },
                                    { value: 'widowed', label: 'أرمل' },
                                ]}
                                error={errors.marital_status}
                            />
                        </div>
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
}
