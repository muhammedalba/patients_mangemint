import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Service } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
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
    const columns: ColumnDef<any>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'category', accessorKey: 'category', header: '  الفئة' },
        { id: 'name', accessorKey: 'name', header: ' اسم الخدمة' },
        { id: 'description', accessorKey: 'description', header: 'الوصف' },
        { id: 'price', accessorKey: 'price', header: 'التكلفة' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const services = row.original;
                return (
                    <TableActions
                        item={services}
                        routes={{
                            edit: 'services.edit',
                            delete: 'services.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذه الخدمة"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    const handleDelete = (id: number): void => {
        router.delete(route('services.destroy', id));
    };
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

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
            title: 'الخدمات الطبية',
            href: route('services.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الخدمات الطبية" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الخدمات الطبية</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}

                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        showSearch={true}
                        showButton={true}
                        buttonLabel="إضافة خدمة"
                        buttonRoute="services.create"
                    />
                    <section className="p-4">
                        <DynamicTable
                            data={[...services.data].reverse()}
                            columns={columns}
                        />
                    </section>
                </div>
                <Pagination links={services.links} />
            </div>
        </AppLayout>
    );
}
