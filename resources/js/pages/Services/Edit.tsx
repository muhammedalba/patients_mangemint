import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { Service, ServiceCategory, type BreadcrumbItem } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function EditService({
    service,
    categories,
}: {
    service: Service;
    categories: ServiceCategory[];
}) {
    const { data, setData, patch, processing, errors } = useForm<{
        name: string;
        description: string;
        price: string;
        category_id: string;
    }>({
        name: service.name || '',
        description: service.description || '',
        price: String(service.price ?? ''),
        category_id: service.category_id || '',
    });
    const { success, error } = useAppToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('services.update', service.id), {
            onSuccess: () => {
            success(
                'تم تعديل الخدمة الطبية بنجاح',
            );
        },
        onError: () => {
            error(
                'فشل تعديل الخدمة الطبية',
                'يرجى التحقق من البيانات المدخلة'
            );
        },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Services', href: route('services.index') },
        {
            title: `Update: ${service.name}`,
            href: route('services.edit', service.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل الخدمة الطبية: ${service.name}`} />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل الخدمة الطبية
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormSelect
                            name="category_id"
                            label="اسم فئة الخدمة الطبية"
                            value={data.category_id}
                            onChange={(val) => {
                                if (Array.isArray(val)) return;
                                setData('category_id', val);
                            }}
                            options={categories.map(
                                (category: ServiceCategory) => ({
                                    value: String(category.id),
                                    label: category.name,
                                }),
                            )}
                        />
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
                            label="التكلفة"
                            type="number"
                            name="price"
                            value={data.price}
                            onChange={(val: string) => setData('price', val)}
                            placeholder="تكلفة الخدمة"
                            error={errors.price}
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
                            href={route('services.index')}
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
