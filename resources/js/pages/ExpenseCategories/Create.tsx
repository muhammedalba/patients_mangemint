import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';
export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('expense-categories.store'), { onSuccess: () => reset() });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'فئات المصروف',
            href: route('expense-categories.index'),
        },
        {
            title: 'إضافة فئة المصروف',
            href: route('expense-categories.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة فئة المصروف " />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-4 text-center text-xl font-bold text-gray-700">
                    إضافة فئة المصروف
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label="اسم الفئة"
                            name="name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            placeholder="ادخل اسم فئة المصروف"
                            error={errors.name}
                        />
                        <FormSelect
                            label="نوع الفئة"
                            name="type"
                            value={data.type}
                            onChange={(val) => setData('type', val)}
                            options={[
                                { value: 'fixed', label: 'ثابت' },
                                { value: 'variable', label: 'متغير' },
                            ]}
                            error={errors.type}
                        />
                    </div>

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
                            loadingLabel="جارِ الحفظ ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
