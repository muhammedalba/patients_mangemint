import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

export default function EditPatient({ genders, marital_statuses, patient }) {
    console.log(genders);
    console.log(marital_statuses);

    const { data, setData, patch, processing, errors } = useForm({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        birth_date: patient.birth_date || '',
        gender: patient.gender || '',
        marital_status: patient.marital_status || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            patch(route('patients.update', patient.id));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
                            label=" البريد الإلكتروني "
                            name="name"
                            value={data.email}
                            onChange={(val) => setData('email', val)}
                            placeholder=" البريد الإلكتروني"
                            error={errors.email}
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
                                onChange={(val) => setData('gender', val)}
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
                                onChange={(val) =>
                                    setData('marital_status', val)
                                }
                                options={[
                                    { value: 'single', label: 'عازب' },
                                    { value: 'married', label: 'متزوج' },
                                    { value: 'divorced', label: 'مطلق' },
                                    { value: 'widow', label: 'أرمل' },
                                ]}
                                error={errors.marital_status}
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-200 ${
                                processing
                                    ? 'cursor-not-allowed bg-blue-400'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {processing ? 'جارِ الحفظ ...' : ' حفظ '}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
