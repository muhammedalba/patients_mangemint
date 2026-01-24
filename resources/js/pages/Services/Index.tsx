import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Service } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { services, auth, filters } = usePage<{
        services: PaginatedData<Service>;
        auth: { user: { roles: string[] } };
        filters: { search?: string };
    }>().props;
    const { success, error } = useAppToast();
    const canDeleteRoles = ['admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const columns: ColumnDef<Service>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'category', accessorKey: 'category', header: '  الفئة' },
        { id: 'name', accessorKey: 'name', header: ' اسم الخدمة' },
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
        router.delete(route('services.destroy', id), {
            onSuccess: () => {
                success('تم حذف خدمة بنجاح');
            },
            onError: () => {
                error('فشل حذف خدمة، يرجى المحاولة مرة أخرى لاحقًا');
            },
        });
    };
    const [search, setSearch] = useState(filters.search || '');
    const [perPage] = useState(10);
    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/services',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

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
                    <section className="p-4">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة خدمة"
                            buttonRoute="services.create"
                        />

                        <DynamicTable
                            data={[...services.data]}
                            columns={columns}
                        />
                    </section>
                </div>
                <Pagination
                    links={services.links}
                    search={search}
                    perPage={perPage}
                    baseRoute="/services"
                />
            </div>
        </AppLayout>
    );
}
