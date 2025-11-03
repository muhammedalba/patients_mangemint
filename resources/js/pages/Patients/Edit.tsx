import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { Patient, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
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
        { title: 'Patient', href: route('patients.index') },
        {
            title: `Update: ${patient.name}`,
            href: route('patients.edit', patient.id),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={` Update Patient: ${patient.name}`} />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل بيانات المريض
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-gray-700"
                            >
                                الاسم الكامل
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="الاسم الكامل"
                                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-gray-700"
                            >
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="Email"
                                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="birth_date"
                                className="mb-2 block text-gray-700"
                            >
                                تاريخ الميلاد
                            </label>
                            <input
                                id="birth_date"
                                type="date"
                                name="birth_date"
                                value={data.birth_date}
                                onChange={(e) =>
                                    setData('birth_date', e.target.value)
                                }
                                placeholder="Birth year"
                                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.birth_date && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.birth_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-gray-700"
                            >
                                رقم الهاتف
                            </label>
                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                placeholder="Phone"
                                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-between">
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="mb-2 block text-gray-700"
                                >
                                    الجنس
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData(
                                            'gender',
                                            e.target.value as
                                                | 'male'
                                                | 'female'
                                                | 'other',
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option disabled value="">
                                        Choose gender
                                    </option>
                                    <option value="male">ذكر</option>
                                    <option value="female">أنثى</option>
                                </select>
                                {errors.gender && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="marital_status"
                                    className="mb-2 block text-gray-700"
                                >
                                    الحالة الاجتماعية
                                </label>
                                <select
                                    id="marital_status"
                                    name="marital_status"
                                    value={data?.marital_status}
                                    onChange={(e) =>
                                        setData(
                                            'marital_status',
                                            e.target.value as
                                                | 'single'
                                                | 'married'
                                                | 'divorced'
                                                | 'widowed',
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option disabled value="">
                                        اختر حالة
                                    </option>
                                    <option value="single">عازب</option>
                                    <option value="married">متزوج</option>
                                    <option value="divorced">مطلق</option>
                                    <option value="widowed">أرمل</option>
                                </select>
                                {errors?.marital_status && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors?.marital_status}
                                    </p>
                                )}
                            </div>
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
