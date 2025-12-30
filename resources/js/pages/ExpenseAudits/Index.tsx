import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Index() {
    const { expense, audits } = usePage<any>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        new_amount: '',
        reason: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('expense-audits.store', expense.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title={`Audits for Expense #${expense.id}`} />
            <div className="mx-auto mt-6 max-w-3xl">
                <h1 className="mb-4 text-xl font-bold">Expense Audits</h1>

                <form onSubmit={handleSubmit} className="mb-6 space-y-3">
                    <div>
                        <label>New Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.new_amount}
                            onChange={(e) =>
                                setData('new_amount', e.target.value)
                            }
                            className="input"
                        />
                        {errors.new_amount && (
                            <div className="text-sm text-red-500">
                                {errors.new_amount}
                            </div>
                        )}
                    </div>
                    <div>
                        <label>Reason</label>
                        <input
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="input"
                        />
                        {errors.reason && (
                            <div className="text-sm text-red-500">
                                {errors.reason}
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            disabled={processing}
                            className="btn btn-primary"
                        >
                            {processing ? 'Saving...' : 'Record Audit'}
                        </button>
                    </div>
                </form>

                <div>
                    <table className="w-full border bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">#</th>
                                <th className="p-2">Old</th>
                                <th className="p-2">New</th>
                                <th className="p-2">Reason</th>
                                <th className="p-2">Changed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audits.map((a: any) => (
                                <tr key={a.id} className="border-t">
                                    <td className="p-2">{a.id}</td>
                                    <td className="p-2">{a.old_amount}</td>
                                    <td className="p-2">{a.new_amount}</td>
                                    <td className="p-2">{a.reason}</td>
                                    <td className="p-2">{a.changed_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
