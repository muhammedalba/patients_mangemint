import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Service } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function EditServiceCategory({
    category,
}: {
    category: Service;
}) {
    const { data, setData, patch, processing, errors } = useForm<{
        name: string;
        description: string;
    }>({
        name: category.name || '',
        description: category.description || '',
    });
    const { success, error } = useAppToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('service-categories.update', category.id), {
            onSuccess: () => {
            success(
                'تم تعديل فئة الخدمة الطبية بنجاح',
            );
        },
        onError: () => {
            error(
                'فشل تعديل فئة الخدمة الطبية',
                'يرجى التحقق من البيانات المدخلة'
            );
        },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'فئات تصنيف المعالجات',
            href: route('service-categories.index'),
        },
        {
            title: `تعديل فئة تصنيف المعالجة: ${category.name}`,
            href: route('service-categories.edit', category.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل فئة التصنيف : ${category.name}`} />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل الخدمة الطبية
                </h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label="اسم الخدمة الطبية"
                            name="name"
                            type="text"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            placeholder="اسم الخدمة"
                            error={errors.name}
                        />

                        <FormInput
                            label="الوصف"
                            type="textarea"
                            name="description"
                            value={data.description}
                            onChange={(val: string) =>
                                setData('description', val)
                            }
                            placeholder="وصف الخدمة"
                            error={errors.description}
                        />
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('service-categories.index')}
                            className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                        >
                            إنهاء
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
