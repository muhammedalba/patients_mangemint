import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function CreateProcedure() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        cost: string;
        duration_minutes: string;
    }>({
        name: '',
        description: '',
        cost: '',
        duration_minutes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('procedures.store'), {
            onSuccess: () => reset(),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Procedures',
            href: route('procedures.index'),
        },
        {
            title: 'Create Procedure',
            href: route('procedures.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Procedure" />
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    إضافة إجراء جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="اسم الإجراء"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="وصف الإجراء"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="number"
                            name="cost"
                            value={data.cost}
                            onChange={(e) => setData('cost', e.target.value)}
                            placeholder="التكلفة"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.cost && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.cost}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="number"
                            name="duration_minutes"
                            value={data.duration_minutes}
                            onChange={(e) => setData('duration_minutes', e.target.value)}
                            placeholder="المدة (بالدقائق)"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.duration_minutes && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.duration_minutes}
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
                            {processing ? 'جارٍ الحفظ...' : 'حفظ الإجراء'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
