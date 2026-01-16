import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { FormTextArea } from '@/components/FormTextArea';
import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

interface Procedure {
    id: number;
    name: string;
    description: string;
    cost: number;
    tooth_id: number;
}

export default function EditProcedure({
    procedure,
    teeth,
    services_category,
}: {
    procedure: Procedure;
    teeth: any[];
    services_category: any[];
}) {
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
    console.log(props, 'props');

    const { data, setData, put, processing, errors } = useForm({
        name: procedure.name || '',
        description: procedure.description || '',
        cost: procedure.cost || 0,
        tooth_id: procedure.tooth_id || '',
        patient_id: procedure.patient_id || '',
        status: (procedure as any).status || 'planned',
    });
    console.log(services_category, 'services_category edit');
    console.log(teeth, 'teeth edit');
    console.log(procedure, 'procedure edit');

    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(data, 'data');

        setIsLoading(true);
        try {
            put(route('procedures.update', procedure.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setSubmitted(true);
                    setTimeout(() => setSubmitted(false), 2500);
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الإجراءات',
            href: route('procedures.index'),
        },
        {
            title: 'تعديل الإجراء',
            href: route('procedures.edit', procedure.id),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل الإجراء" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل الإجراء
                </h1>

                {/* <form onSubmit={handleSubmit} className="space-y-6">
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
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
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
                            onChange={(e) =>
                                setData('cost', e.target.valueAsNumber)
                            }
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
                        <label className="mb-1 block text-gray-700">السن</label>
                        <select
                            name="tooth_id"
                            value={data.tooth_id}
                            onChange={(e) =>
                                setData('tooth_id', e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <option value="">اختر السن</option>
                            {teeth.map((tooth) => (
                                <option key={tooth.id} value={tooth.id}>
                                    {tooth.tooth_number}
                                </option>
                            ))}
                        </select>
                        {errors.tooth_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.tooth_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            الحالة
                        </label>
                        <select
                            name="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <option value="planned">مخطط</option>
                            <option value="in_progress">قيد التنفيذ</option>
                            <option value="completed">مكتمل</option>
                            <option value="cancelled">ملغي</option>
                        </select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.status}
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
                </form> */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                    <FormInput
                        label="الاسم"
                        name="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e)}
                        placeholder="اسم الإجراء"
                        error={errors.name}
                    />

                    <FormInput
                        label="التكلفة"
                        type="number"
                        value={data.cost ?? ''}
                        onChange={(e) =>
                            setData('cost', e === '' ? null : Number(e))
                        }
                        placeholder="التكلفة"
                        error={errors.cost}
                    />

                    <FormSelect
                        label="السن"
                        name="tooth_id"
                        value={data.tooth_id}
                        onChange={(e) => setData('tooth_id', e)}
                        error={errors.tooth_id}
                        options={[
                            { label: 'اختر السن', value: '' },
                            ...teeth.map((tooth) => ({
                                label: tooth.tooth_number,
                                value: tooth.id,
                            })),
                        ]}
                    />

                    <FormSelect
                        label="الحالة"
                        name="status"
                        value={data.status}
                        onChange={(e) => setData('status', e)}
                        error={errors.status}
                        options={[
                            { label: 'مخطط', value: 'planned' },
                            { label: 'قيد التنفيذ', value: 'in_progress' },
                            { label: 'مكتمل', value: 'completed' },
                            { label: 'ملغي', value: 'cancelled' },
                        ]}
                    />
                     <FormTextArea
                        label="الوصف"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e)}
                        placeholder="وصف الإجراء"
                        error={errors.description}
                        rows={2}
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
}
