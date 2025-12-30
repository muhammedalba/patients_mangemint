import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function Edit() {
    const { category } = usePage<any>().props;
    const { data, setData, post, processing, errors } = useForm({
        name: category.name || '',
        type: category.type || '',
        _method: 'PATCH',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('expense-categories.update', category.id));
    };
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فئة المصروف', href: route('expense-categories.index') },
        {
            title: `تعديل  فئة المصروف`,
            href: route('expense-categories.edit', category.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل فئة المصروف" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل فئة المصروف
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label="Name"
                            name="name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            placeholder="Enter category name"
                            error={errors.name}
                        />

                        <FormSelect
                            label="Type"
                            name="type"
                            value={data.type}
                            onChange={(val) => setData('type', val)}
                            options={[
                                { value: 'fixed', label: 'ثابت' },
                                { value: 'variable', label: 'متغير' },
                            ]}
                            error={errors.type}
                        />

                        <div className="flex items-center justify-end space-x-2">
                            <Link
                                href={route('expense-categories.index')}
                                className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                            >
                                إنهاء
                            </Link>

                            <FormButton
                                processing={processing}
                                label="حفظ"
                                loadingLabel="جارِ التعديل ..."
                            />
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
