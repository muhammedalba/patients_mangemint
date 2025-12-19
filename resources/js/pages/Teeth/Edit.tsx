import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

interface tooth {
    id?: number | string;
    patient_id: string;
    tooth_number: string;
    status: string;
    notes: string;
    patient?: {
        name: string;
        id: string;
    };
    procedures: any[];
}

export default function EditTooth({ tooth }: { tooth: tooth }) {
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
    console.log(props);
    console.log(tooth);

    const { data, setData, put, processing, errors } = useForm({
        patient_id: tooth.patient_id || '',
        tooth_number: tooth.tooth_number || '',
        status: tooth.status || '',
        notes: tooth.notes || '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('teeth.update', tooth.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 2500);
            },
        });
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit tooth',
            href: '/EditTooth',
        },
    ];
    {
        console.log(data);
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل السن" />
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
                    تعديل السن
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-1 block text-gray-700">
                            رقم المريض
                        </label>

                        <input
                            type="text"
                            value={tooth?.patient?.name}
                            onChange={(e) =>
                                setData('patient_id', e.target.value)
                            }
                            placeholder="رقم المريض"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.patient_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.patient_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            رقم السن
                        </label>
                        <input
                            type="text"
                            value={data.tooth_number}
                            onChange={(e) =>
                                setData('tooth_number', e.target.value)
                            }
                            placeholder="رقم السن"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.tooth_number && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.tooth_number}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            الحالة
                        </label>
                        <input
                            type="text"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            placeholder="الحالة"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            ملاحظات
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="ملاحظات"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded-lg px-8 py-2.5 font-semibold text-white transition-all duration-200 ${
                                processing
                                    ? 'cursor-not-allowed bg-green-400'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {processing ? 'جارٍ التحديث...' : 'تحديث'}
                        </button>

                        {submitted && (
                            <p className="mt-3 text-sm text-green-600">
                                ✅ تم التحديث بنجاح!
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-2xl font-bold">الإجراءات</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">الاسم</th>
                            <th className="border px-2 py-1">الوصف</th>
                            <th className="border px-2 py-1">التكلفة</th>
                            <th className="border px-2 py-1">
                                المدة (بالدقائق)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tooth.procedures.map((procedure, i) => (
                            <tr key={procedure.id}>
                                <td className="border px-2 py-1">{i + 1}</td>
                                <td className="border px-2 py-1">
                                    {procedure.name}
                                </td>
                                <td className="border px-2 py-1">
                                    {procedure.description}
                                </td>
                                <td className="border px-2 py-1">
                                    {procedure.cost}
                                </td>
                                <td className="border px-2 py-1">
                                    {procedure.duration_minutes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
