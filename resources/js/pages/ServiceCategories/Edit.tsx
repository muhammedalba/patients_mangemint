import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Service } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useCallback } from 'react';
import { route } from 'ziggy-js';
import { Layers, FileText } from 'lucide-react';

interface EditServiceCategoryProps {
    category: Service;
}

export default function EditServiceCategory({ category }: EditServiceCategoryProps) {
    const { data, setData, patch, processing, errors } = useForm<{
        name: string;
        description: string;
    }>({
        name: category.name || '',
        description: category.description || '',
    });

    const { success, error } = useAppToast();

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            patch(route('service-categories.update', category.id), {
                onSuccess: () => {
                    success('تم تعديل فئة الخدمة الطبية بنجاح');
                },
                onError: () => {
                    error(
                        'فشل تعديل فئة الخدمة الطبية',
                        'يرجى التحقق من البيانات المدخلة'
                    );
                },
            });
        },
        [patch, category.id, success, error]
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فئات الخدمات الطبية', href: route('service-categories.index') },
        {
            title: `تعديل فئة الخدمة: ${category.name}`,
            href: route('service-categories.edit', category.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل فئة الخدمة: ${category.name}`} />

            <div className="mx-auto mt-6 max-w-full rounded-2xl border border-slate-100 bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800">
                            تعديل فئة الخدمة
                        </h1>
                        <p className="text-sm text-slate-500">
                            قم بتحديث اسم وفئة الخدمة الطبية
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label="ادخل اسم الخدمة الطبية"
                            name="name"
                            type="text"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                            icon={Layers}
                        />

                        <FormInput
                            label="أدخل وصفًا مختصرًا  للخدمة"
                            type="textarea"
                            name="description"
                            value={data.description}
                            onChange={(val: string) => setData('description', val)}
                            error={errors.description}
                            icon={FileText}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <Link
                            href={route('service-categories.index')}
                            className="rounded-xl border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            إنهاء
                        </Link>

                        <FormButton
                            processing={processing}
                            label="تحديث الفئة"
                            loadingLabel="جارِ التحديث..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
