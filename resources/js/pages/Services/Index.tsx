import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Service } from '@/types';
import { Head, Link , router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { services, auth, flash, filters } = usePage<{
        services: PaginatedData<Service>;
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;

    const canDeleteRoles = ['admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    console.log(services, 'services');

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleDelete = (id: number): void => {
        if (confirm('Are you sure you want to delete this service?')) {
            router.delete(route('services.destroy', id));
        }
    };
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(
                route('services.index'),
                { search },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Services',
            href: route('services.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">Services</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}
                    <div className="mb-4 flex items-center justify-between">
                        <Link
                            href={route('services.create')}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            <span className="flex items-center gap-1">
                                Add Service
                                <i className="material-icons text-lg">add</i>
                            </span>
                        </Link>
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 shadow-sm transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <span className="absolute top-2.5 left-3 text-gray-400">
                                <i className="material-icons text-lg">search</i>
                            </span>
                        </div>
                    </div>

                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">category</th>
                                <th className="border px-2 py-1">Name</th>
                                <th className="border px-2 py-1">Description</th>
                                <th className="border px-2 py-1">Price</th>
                                <th className="border px-2 py-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services?.data?.map((service, i) => (
                                <tr key={service.id}>
                                    <td className="border px-2 py-1 text-center">{i + 1}</td>
                                    <td className="border px-2 py-1 text-center">{service.category}</td>
                                    <td className="border px-2 py-1 text-center">{service.name}</td>
                                    <td className="border px-2 py-1 text-center">{service.description}</td>
                                    <td className="border px-2 py-1 text-center">{service.price}</td>
                                    <td className="border px-2 py-1 text-center">
                                        <Link
                                            href={route('services.edit', service.id)}
                                            className="mr-2 text-xs font-bold text-gray-700"
                                        >
                                            <i className="material-icons">edit</i>
                                        </Link>
                                        {userHasDeletePermission && (
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="mr-2 text-xs font-bold text-red-500"
                                            >
                                                <i className="material-icons">delete</i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination links={services.links} />
                </div>
            </div>
        </AppLayout>
    );
}
