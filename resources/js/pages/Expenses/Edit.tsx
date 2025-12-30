import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function Edit() {
    const { expense, categories } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        amount: expense.amount || '',
        description: expense.description || '',
        expense_category_id: expense.expense_category_id || '',
        payment_method: expense.payment_method || '',
        expense_date: expense.expense_date || '',
        _method: 'PATCH',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('expenses.update', expense.id));
    };
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المصروف', href: route('expenses.index') },
        {
            title: `تعديل  المصروف`,
            href: route('expenses.edit', expense.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`  تعديل المصروف: ${expense.name}`} />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل المصروف
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            type="number"
                            label="المبلغ"
                            name="amount"
                            value={data.amount}
                            onChange={(val) => setData('amount', val)}
                            placeholder="Enter amount"
                            error={errors.amount}
                        />

                        <FormSelect
                            label="فئة المصروف"
                            name="expense_category_id"
                            value={data.expense_category_id}
                            onChange={(val) =>
                                setData('expense_category_id', val)
                            }
                            options={[
                                { value: '', label: '' },
                                ...categories.map((c: any) => ({
                                    value: c.id,
                                    label: c.name,
                                })),
                            ]}
                            error={errors.expense_category_id}
                        />

                        <FormSelect
                            label="طريقة الدفع "
                            name="payment_method"
                            value={data.payment_method}
                            onChange={(val) => setData('payment_method', val)}
                            options={[
                                { value: 'cash', label: 'نقداً' },
                                { value: 'card', label: 'بطاقة' },
                                { value: 'transfer', label: 'تحويل بنكي' },
                                { value: 'other', label: 'أخرى' },
                            ]}
                            error={errors.payment_method}
                        />

                        <FormInput
                            type="date"
                            label="التاريخ"
                            name="expense_date"
                            value={data.expense_date}
                            onChange={(val) => setData('expense_date', val)}
                            error={errors.expense_date}
                        />

                        <FormInput
                            type="textarea"
                            label="الملاحظات"
                            name="description"
                            value={data.description}
                            onChange={(val) => setData('description', val)}
                            placeholder=""
                            error={errors.description}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('expenses.index')}
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
