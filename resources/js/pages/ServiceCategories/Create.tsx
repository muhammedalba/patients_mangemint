import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useCallback } from 'react';
import { route } from 'ziggy-js';
import { Layers, FileText } from 'lucide-react';

export default function CreateServiceCategory() {

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
    }>({
        name: '',
        description: '',
    });

    const { success, error } = useAppToast();

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            post(route('service-categories.store'), {
                onSuccess: () => {
                    success(
                        'تم حفظ فئة الخدمة الطبية بنجاح',
                        'تمت إضافة فئة الخدمة إلى جدول فئات الخدمات الطبية'
                    );
                },
                onError: () => {
                    error(
                        'فشل حفظ فئة الخدمة الطبية',
                        'يرجى التحقق من البيانات المدخلة'
                    );
                },
            });
        },
        [post, success, error]
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'فئات الخدمات الطبية',
            href: route('service-categories.index'),
        },
        {
            title: 'إضافة فئة خدمة',
            href: route('service-categories.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة فئة خدمة" />

            <div className="mx-auto mt-6 max-w-full rounded-2xl border border-slate-100 bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800">
                            إضافة فئة خدمة
                        </h1>
                        <p className="text-sm text-slate-500">
                            أنشئ فئة جديدة لتصنيف الخدمات الطبية
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 px-6 py-6"
                >
                    <div className="grid grid-cols-1 gap-6 ">
                        <FormInput
                            label="ادخل اسم الخدمة الطبية"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                            icon={Layers}
                        />

                        <FormInput
                            label="أدخل وصفًا مختصرًا للخدمة"
                            type="textarea"
                            name="description"
                            value={data.description}
                            onChange={(val) => setData('description', val)}
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
                            label="حفظ الفئة"
                            loadingLabel="جارِ الحفظ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
