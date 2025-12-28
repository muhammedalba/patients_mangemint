import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Index() {
    const { expenses, filters } = usePage<any>().props;
console.log('expenses',expenses);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            Inertia.delete(route('expenses.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Expenses" />
            <div className="mx-auto mt-6 max-w-6xl">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Expenses</h1>
                    <a
                        href={route('expenses.create')}
                        className="btn btn-primary"
                    >
                        Add Expense
                    </a>
                </div>

                <table className="w-full table-auto border bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">#</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Payment Method</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.data?.map((exp: any) => (
                            <tr key={exp.id} className="border-t">
                                <td className="p-2">{exp.id}</td>
                                <td className="p-2">{exp.amount}</td>
                                <td className="p-2">
                                    {exp.category?.name ?? '-'}
                                </td>
                                <td className="p-2">{exp.payment_method}</td>
                                <td className="p-2">
                                    {exp.expense_date ?? exp.created_at}
                                </td>
                                <td className="p-2">
                                    <a
                                        href={route('expenses.edit', exp.id)}
                                        className="btn btn-sm btn-warning mr-2"
                                    >
                                        Edit
                                    </a>
                                    <button
                                        onClick={() => handleDelete(exp.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4">
                    <Pagination links={expenses.links} />
                </div>
            </div>
        </AppLayout>
    );
}
