import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, CalendarDays, Lock } from 'lucide-react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        year: '',
        month: '',
    });

    const { success, error } = useAppToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('month-closures.closeMonth'), {
            onSuccess: () => {
                success('تم حفظ إغلاق الشهر بنجاح');
            },
            onError: () => {
                error('فشل حفظ إغلاق الشهر');
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'إغلاق الشهر',
            href: route('month-closures.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إغلاق الشهر" />

            <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-slate-100 bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
                {/* Header */}
                <div className="mb-8 ">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <Lock className="h-5 w-5" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">
                            إغلاق الشهر المالي
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 w-full text-center m-5 mb-5 ">
                        بعد الاغلاق لن تستطيع اضافه او تعديل اي مصاريف في هذا
                        الشهر
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label="ادخل السنه مثال : 2026"
                            name="year"
                            type="number"
                            value={data.year}
                            onChange={(val) => setData('year', val)}
                            icon={CalendarDays}
                            error={errors.year}
                        />

                        <FormInput
                            label="ادخل الشهر مثال (1 - 12)"
                            name="month"
                            type="number"
                            value={data.month}
                            onChange={(val) => setData('month', val)}
                            icon={Calendar}
                            error={errors.month}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Link
                            href={route('month-closures.index')}
                            className="rounded-lg bg-slate-100 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                            إنهاء
                        </Link>

                        <FormButton
                            processing={processing}
                            label={'إغلاق'}
                            loadingLabel="جارِ الإغلاق ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
