import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

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

    return (
        <AppLayout>
            <Head title="Edit Expense" />
            <div className="mx-auto mt-6 max-w-2xl rounded bg-white p-6">
                <h1 className="mb-4 text-xl font-bold">Edit Expense</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="input"
                        />
                        {errors.amount && (
                            <div className="text-sm text-red-500">
                                {errors.amount}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Category</label>
                        <select
                            value={data.expense_category_id}
                            onChange={(e) =>
                                setData('expense_category_id', e.target.value)
                            }
                            className="input"
                        >
                            <option value="">Select category</option>
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.expense_category_id && (
                            <div className="text-sm text-red-500">
                                {errors.expense_category_id}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Payment Method</label>
                        <input
                            value={data.payment_method}
                            onChange={(e) =>
                                setData('payment_method', e.target.value)
                            }
                            className="input"
                        />
                        {errors.payment_method && (
                            <div className="text-sm text-red-500">
                                {errors.payment_method}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Date</label>
                        <input
                            type="date"
                            value={data.expense_date}
                            onChange={(e) =>
                                setData('expense_date', e.target.value)
                            }
                            className="input"
                        />
                        {errors.expense_date && (
                            <div className="text-sm text-red-500">
                                {errors.expense_date}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="input"
                        />
                        {errors.description && (
                            <div className="text-sm text-red-500">
                                {errors.description}
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            disabled={processing}
                            className="btn btn-primary"
                        >
                            {processing ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
