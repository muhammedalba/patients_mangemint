import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

interface ServiceCategoryFormData {
    name: string;
    description: string;
}

export default function CreateServiceCategory() {
    const { serviceCategory } = usePage<{
        serviceCategory: any;
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;
    console.log(serviceCategory, 'serviceCategory');

    const { data, setData, post, processing, errors, reset } =
        useForm<ServiceCategoryFormData>({
            name: '',
            description: '',
        });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('service-categories.store'), {
            onSuccess: () => reset(),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'فئات تصنيف المعالجات',
            href: route('service-categories.index'),
        },
        {
            title: 'إضافة فئة تصنيف',
            href: route('service-categories.create'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة فئة تصنيف" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة فئة تصنيف
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mx-auto max-w-md">
                        <FormInput
                            label="اسم الخدمة"
                            type="text"
                            name="name"
                            value={data.name}
                           onChange={(val) => setData('name', val)}
                            placeholder="اسم الخدمة "
                            error={errors.name}
                        />

                        <FormInput
                            label="الوصف"
                            type="textarea"
                            name="description"
                            value={data.description}
                            onChange={(val) => setData('description', val)}
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
                            label="حفظ"
                            loadingLabel="جارِ الحفظ ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
