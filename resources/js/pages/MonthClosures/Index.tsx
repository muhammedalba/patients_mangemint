import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Index() {
    const { closures } = usePage<any>().props;
console.log(closures);

    const handleDelete = (id: number) => {
        if (confirm('Delete this month closure?')) {
            Inertia.delete(route('month-closures.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Month Closures" />
            <div className="mx-auto mt-6 max-w-4xl">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Month Closures</h1>
                    <a
                        href={route('month-closures.close')}
                        className="btn btn-primary"
                    >
                        Close Month
                    </a>
                </div>

                <table className="w-full border bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">#</th>
                            <th className="p-2">Year</th>
                            <th className="p-2">Month</th>
                            <th className="p-2">Closed At</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {closures.data?.map((c: any) => (
                            <tr key={c.id} className="border-t">
                                <td className="p-2">{c.id}</td>
                                <td className="p-2">{c.year}</td>
                                <td className="p-2">{c.month}</td>
                                <td className="p-2">{c.closed_at}</td>
                                <td className="p-2">
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
                    <Pagination links={closures.links} />
                </div>
            </div>
        </AppLayout>
    );
}
