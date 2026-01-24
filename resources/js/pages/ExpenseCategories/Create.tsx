import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useCallback } from 'react';
import { route } from 'ziggy-js';
import { ClipboardList, Layers } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: '',
    });

    const { success, error } = useAppToast();

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();

            post(route('expense-categories.store'), {
                onSuccess: () => {
                    success(
                        'تم حفظ فئة المصروف بنجاح',
                        'تمت إضافة فئة المصروف إلى جدول فئات المصروفات',
                    );
                },
                onError: () => {
                    error(
                        'فشل حفظ فئة المصروف',
                        'يرجى التحقق من البيانات المدخلة',
                    );
                },
            });
        },
        [post, success, error],
    );

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
            <Head title="إضافة فئة المصروف" />

            <div className="mx-auto mt-6 max-w-full">
                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <ClipboardList size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-800">
                                إضافة فئة مصروف
                            </h1>
                            <p className="text-sm text-slate-500">
                                إنشاء فئة جديدة لتنظيم مصروفات العيادة
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8 px-6 py-6"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-center">
                            <FormInput
                                label="اسم الفئة"
                                name="name"
                                value={data.name}
                                onChange={(val) => setData('name', val)}
                            
                                error={errors.name}
                                icon={ClipboardList}
                            />

                            <FormSelect
                                label="نوع الفئة"
                                name="type"
                                value={data.type}
                                onChange={(val) =>
                                    setData(
                                        'type',
                                        Array.isArray(val)
                                            ? val[0] ?? ''
                                            : val,
                                    )
                                }
                                options={[
                                    { value: 'fixed', label: 'ثابت' },
                                    { value: 'variable', label: 'متغير' },
                                ]}
                                error={errors.type}
                                icon={Layers}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                            <Link
                                href={route('expense-categories.index')}
                                className="rounded-xl border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                إلغاء
                            </Link>

                            <FormButton
                                processing={processing}
                                label="حفظ الفئة"
                                loadingLabel="جارِ الحفظ..."
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
