import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

interface ServiceFormData {
    name: string;
    description: string;
    price: number;
    category_id: string;
}

export default function CreateService() {
    const { categories } = usePage<{
        categories: any;
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;
    console.log(categories, 'categories');

    const { data, setData, post, processing, errors, reset } =
        useForm<ServiceFormData>({
            name: '',
            description: '',
            price: 0,
            category_id: '',
        });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('services.store'), {
            onSuccess: () => reset(),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الخدمات الطبية', href: route('services.index') },
        { title: 'إضافة خدمة طبية', href: route('services.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add new service" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة خدمة طبية
                </h1>

                <form
                    onSubmit={handleSubmit} className="space-y-4"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormSelect
                        label="الفئة"
                        name="category_id"
                        value={data.category_id}
                        onChange={(val: string) => setData('category_id', val)}
                        options={[
                            { value: '', label: 'Select a category' },
                            ...(categories.map((category: any) => ({
                                value: String(category.id),
                                label: category.name,
                            })) ?? []),
                        ]}
                        error={errors.category_id}
                    />

                    <FormInput
                        label="اسم الخدمة"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(val: string) => setData('name', val)}
                        placeholder="اسم الخدمة "
                        error={errors.name}
                    />

                    <FormInput
                        label="التكلفة"
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={(val: string) =>
                            setData('price', parseFloat(val))
                        }
                        placeholder="تكلفة الخدمة"
                        error={errors.price}
                    />

                    <FormInput
                        label="الوصف"
                        type="textarea"
                        name="description"
                        value={data.description}
                        onChange={(val: string) => setData('description', val)}
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
                            label="حفظ"
                            loadingLabel="جارِ الحفظ ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
