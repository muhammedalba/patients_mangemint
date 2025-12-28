import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
export default function Index() {
    const { categories } = usePage<any>().props;

    const handleDelete = (id: number) => {
        if (confirm('Delete this category?')) {
            Inertia.delete(route('expense-categories.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Expense Categories" />
            <div className="mx-auto mt-6 max-w-4xl">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Expense Categories</h1>
                    <a
                        href={route('expense-categories.create')}
                        className="btn btn-primary"
                    >
                        Add Category
                    </a>
                </div>

                <table className="w-full border bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">#</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.data?.map((c: any) => (
                            <tr key={c.id} className="border-t">
                                <td className="p-2">{c.id}</td>
                                <td className="p-2">{c.name}</td>
                                <td className="p-2">{c.type}</td>
                                <td className="p-2">
                                    <a
                                        href={route(
                                            'expense-categories.edit',
                                            c.id,
                                        )}
                                        className="btn btn-sm btn-warning mr-2"
                                    >
                                        Edit
                                    </a>
                                    <button
                                        onClick={() => handleDelete(c.id)}
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
                    <Pagination links={categories.links} />
                </div>
            </div>
        </AppLayout>
    );
}
