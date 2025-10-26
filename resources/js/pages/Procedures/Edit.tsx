import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

interface Procedure {
    id: number;
    name: string;
    description: string;
    cost: number;
    duration_minutes: number;
}

export default function EditProcedure({ procedure }: { procedure: Procedure }) {
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();

    const { data, setData, post, processing, errors } = useForm({
        name: procedure.name || '',
        description: procedure.description || '',
        cost: procedure.cost || 0,
        duration_minutes: procedure.duration_minutes || 0,
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('procedures.update', procedure.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 2500);
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Procedures',
            href: route('procedures.index'),
        },
        {
            title: 'Edit Procedure',
            href: route('procedures.edit', procedure.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Procedure" />
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
                    تعديل الإجراء
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-1 block text-gray-700">
                            الاسم
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="اسم الإجراء"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            الوصف
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="وصف الإجراء"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            التكلفة
                        </label>
                        <input
                            type="number"
                            value={data.cost}
                            onChange={(e) => setData('cost', e.target.valueAsNumber)}
                            placeholder="التكلفة"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.cost && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.cost}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            المدة (بالدقائق)
                        </label>
                        <input
                            type="number"
                            value={data.duration_minutes}
                            onChange={(e) => setData('duration_minutes', e.target.valueAsNumber)}
                            placeholder="المدة (بالدقائق)"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.duration_minutes && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.duration_minutes}
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
                            {processing ? 'جارٍ التحديث...' : 'تحديث الإجراء'}
                        </button>

                        {submitted && (
                            <p className="mt-3 text-sm text-green-600">
                                ✅ تم التحديث بنجاح!
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
