import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { FormTextArea } from '@/components/FormTextArea';
import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Procedure, ServiceCategory, Tooth } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

export default function EditProcedure({
    procedure,
    teeth,
    services_category,
}: {
    procedure: Procedure;
    teeth: Tooth[];
    services_category: ServiceCategory[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: procedure.name || '',
        description: procedure.description || '',
        cost: procedure.cost || 0,
        tooth_id: procedure.tooth_id || '',
        patient_id: procedure.patient_id || '',
        status: procedure.status || 'planned',
    });
    console.log(services_category, 'services_category edit');
    console.log(teeth, 'teeth edit');
    console.log(procedure, 'procedure edit');

    const [isLoading, setIsLoading] = useState(false);
    const { success, error } = useAppToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        put(route('procedures.update', procedure.id), {
            onSuccess: () => {
                success(
                    'تم تعديل الإجراء بنجاح',
                );
            },
            onError: () => {
                error('فشل تعديل الإجراء', 'يرجى التحقق من البيانات المدخلة');
            },
        });
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
