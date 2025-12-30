import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';
export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        year: '',
        month: '',
    });
    console.log(errors);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('month-closures.closeMonth'), { onSuccess: () => reset() });
    };
    const breadcrumbs: BreadcrumbItem[] = [
            {
                title: ' إغلاق الشهر',
                href: route('month-closures.index'),
            },
        ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title=" إغلاق الشهر " />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-4 text-center text-xl font-bold text-gray-700">
                    إغلاق الشهر
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label="السنة"
                            name="year"
                            type="number"
                            value={data.year}
                            onChange={(val) => setData('year', val)}
                            placeholder="ادخل السنة"
                            error={errors.year}
                        />
                        <FormInput
                            label="الشهر"
                            name="month"
                            type="number"
                            value={data.month}
                            onChange={(val) => setData('month', val)}
                            placeholder="ادخل الشهر"
                            error={errors.month}
                        />
                    </div>
                </form>
                <div className="flex items-center justify-end space-x-2">
                    <Link
                        href={route('month-closures.index')}
                        className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                    >
                        إنهاء
                    </Link>

                    <FormButton
                        processing={processing}
                        label="إغلاق"
                        loadingLabel="جارِ الإغلاق ..."
                    />
                </div>
            </div>
        </AppLayout>
    );
}
