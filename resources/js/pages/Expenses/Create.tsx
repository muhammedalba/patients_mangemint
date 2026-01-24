import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ExpenseCategory } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useCallback } from 'react';
import { route } from 'ziggy-js';
import {
    CreditCard,
    FileText,
    CalendarDays,
    Layers,
    Wallet,
    
} from 'lucide-react';
import { FormTextArea } from '@/components/FormTextArea';

type PageProps = {
    categories: ExpenseCategory[];
};

export default function Create() {
    const { categories } = usePage<PageProps>().props;
    const { success, error } = useAppToast();

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
        expense_category_id: '',
        payment_method: '',
        expense_date: '',
    });

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();

            post(route('expenses.store'), {
                onSuccess: () => {
                    success(
                        'تم حفظ المصروف بنجاح',
                        'تمت إضافة المصروف إلى جدول المصاريف',
                    );
                },
                onError: () => {
                    error(
                        'فشل حفظ المصروف',
                        'يرجى التحقق من البيانات المدخلة',
                    );
                },
            });
        },
        [post, success, error],
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'المصروفات',
            href: route('expenses.index'),
        },
        {
            title: 'إضافة مصروف',
            href: route('expenses.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة مصروف" />

            <div className="mx-auto mt-6 max-w-5xl">
                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-800">
                                إضافة مصروف
                            </h1>
                            <p className="text-sm text-slate-500">
                                تسجيل مصروف جديد ضمن النظام المالي
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8 px-6 py-6"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormInput
                                label="قيمة المصروف"
                                name="amount"
                                value={data.amount}
                                onChange={(val) => setData('amount', val)}
                                error={errors.amount}
                                icon={CreditCard}
                            />

                            <FormSelect
                                label="فئة المصروف"
                                name="expense_category_id"
                                value={data.expense_category_id}
                                onChange={(val) =>
                                    setData(
                                        'expense_category_id',
                                        Array.isArray(val) ? '' : val,
                                    )
                                }
                                options={categories.map((category) => ({
                                    value: String(category.id),
                                    label: category.name,
                                }))}
                                error={errors.expense_category_id}
                                icon={Layers}
                            />

                            <FormSelect
                                label="طريقة الدفع"
                                name="payment_method"
                                value={data.payment_method}
                                onChange={(val) =>
                                    setData(
                                        'payment_method',
                                        Array.isArray(val) ? '' : val,
                                    )
                                }
                                options={[
                                    { value: 'cash', label: 'نقداً' },
                                    { value: 'card', label: 'بطاقة' },
                                    { value: 'transfer', label: 'تحويل بنكي' },
                                    { value: 'other', label: 'أخرى' },
                                ]}
                                error={errors.payment_method}
                                icon={Wallet}
                            />

                            <FormInput
                                label="تاريخ المصروف"
                                name="expense_date"
                                type="date"
                                value={data.expense_date}
                                onChange={(val) =>
                                    setData('expense_date', val)
                                }
                                error={errors.expense_date}
                                icon={CalendarDays}
                            />


                               <FormTextArea
                                    label="ملاحظات "
                                    name="description"
                                    icon={FileText}
                                    value={data.description}
                                    onChange={(val) => setData('description', val)}
                                    error={errors.description}
                                    rows={2}

                                />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                            <Link
                                href={route('expenses.index')}
                                className="rounded-xl border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                إنهاء
                            </Link>

                            <FormButton
                                processing={processing}
                                label="حفظ"
                                loadingLabel="جارِ الحفظ..."
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
