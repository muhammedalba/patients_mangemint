import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { serviceCategories, auth, flash, filters } = usePage<{
        serviceCategories: PaginatedData<any>;
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;

    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const [showToast, setShowToast] = useState(false);
console.log(serviceCategories,'serviceCategories');

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleDelete = (id: number): void => {
        router.delete(route('service-categories.destroy', id));
    };
    const [search, setSearch] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('service-categories.index'),
                { search },
                {
                    preserveState: true,
                    replace: true,
                    onFinish: () => setIsLoading(false),
                },
            );
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Service Categories',
            href: route('service-categories.index'),
        },
    ];

    const columns: ColumnDef<any>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'name', accessorKey: 'name', header: 'Name' },
        { id: 'description', accessorKey: 'description', header: 'Description' },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const serviceCategory = row.original;
                return (
                    <TableActions
                        item={serviceCategory}
                        routes={{
                            edit: 'service-categories.edit',
                            view: 'service-categories.show',
                            delete: 'service-categories.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="Are you sure you want to delete this service category?"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Service Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">Service Categories</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}
                    <div className="mb-4 flex items-center justify-between">
                        <Link
                            href={route('service-categories.create')}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            <span className="flex items-center gap-1">
                                <i className="material-icons text-lg">add</i>
                                Add Service Category
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
                    <section className="p-6">
                        <DynamicTable
                            data={[...serviceCategories.data].reverse()}
                            columns={columns}
                        />
                    </section>

                    <Pagination links={serviceCategories.links} />
                </div>
            </div>
        </AppLayout>
    );
}
