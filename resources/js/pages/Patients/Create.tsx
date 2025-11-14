import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

interface PatientFormData {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    birth_date: string;
    gender: 'male' | 'female' | 'other';
    marital_status: 'single' | 'married' | 'divorced' | 'widowed';
}

export default function CreatePatient(
    genders: any[],
    marital_statuses: any[],
) {
    const { data, setData, post, processing, errors, reset } =
        useForm<PatientFormData>({
            name: '',
            email: '',
            phone: '',
            address: '',
            notes: '',
            birth_date: '',
            gender: '' as 'male' | 'female' | 'other',
            marital_status: '' as 'single' | 'married' | 'divorced' | 'widowed',
        });
    const [isLoading, setIsLoading] = useState(false);
    console.log(errors, 'errors');
    console.log(genders,'genders');
    console.log(marital_statuses,'marital_statuses');



    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(data, 'data');
        try {
            post(route('patients.store'), {
                onSuccess: () => reset(),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: route('patients.index') },
        { title: 'Add new patient', href: route('patients.create') },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add new patient" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-4 px-6 shadow-lg">
                <h1 className="mt-2 text-center text-xl font-bold text-gray-700">
                    إضافة مريض
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                placeholder="Full name"
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

                        <div className="flex justify-between gap-4">
                            <div className="flex-1">
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
                                    <option value="">اختر</option>
                                    <option value="male">ذكر</option>
                                    <option value="female">أنثى</option>
                                </select>
                                {errors.gender && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>

                            <div className="flex-1">
                                <label
                                    htmlFor="marital_status"
                                    className="mb-2 block text-gray-700"
                                >
                                    الحالة الاجتماعية
                                </label>
                                <select
                                    id="marital_status"
                                    name="marital_status"
                                    value={data.marital_status}
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
                                    <option value="">اختر حالة </option>
                                    <option value="single">عازب</option>
                                    <option value="married">متزوج</option>
                                    <option value="divorced">مطلق</option>
                                    <option value="widowed">أرمل</option>
                                </select>
                                {errors.marital_status && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.marital_status}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="notes"
                                className="mb-2 block text-gray-700"
                            >
                                الملاحظات
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                placeholder="Notes"
                                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={3}
                            ></textarea>
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-200 ${
                                    processing
                                        ? 'cursor-not-allowed bg-blue-400'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {processing ? 'جارِ الحفظ ... ' : 'حفظ'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
