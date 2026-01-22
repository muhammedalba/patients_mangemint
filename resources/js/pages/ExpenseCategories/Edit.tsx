import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ExpenseCategory } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

type PageProps = {
    category: ExpenseCategory;
};
export default function Edit() {
    const { category } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm({
        name: category.name || '',
        type: category.type || '',
        _method: 'PATCH',
    });
    const { success, error } = useAppToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('expense-categories.update', category.id), {
            onSuccess: () => {
                success(
                    'تم تعديل فئة المصروف بنجاح',
                );
            },
            onError: () => {
                error(
                    'فشل تعديل فئة المصروف',
                    'يرجى التحقق من البيانات المدخلة',
                );
            },
        });
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
                            label="فئة المصروف"
                            name="name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            placeholder="Enter category name"
                            error={errors.name}
                        />

                        <FormSelect
                            label="نوع فئة المصروف"
                            name="type"
                            value={data.type}
                            onChange={(val) =>
                                setData(
                                    'type',
                                    Array.isArray(val) ? (val[0] ?? '') : val,
                                )
                            }
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
                            label="تعديل"
                            loadingLabel="جارِ التعديل ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
