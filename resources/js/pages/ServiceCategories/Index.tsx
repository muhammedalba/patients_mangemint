import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, ServiceCategory, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { serviceCategories, auth, filters } = usePage<{
        serviceCategories: PaginatedData<ServiceCategory>;
        auth: { user: { roles: string[] } };
        filters: { search?: string };
    }>().props;

    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    console.log(serviceCategories, 'serviceCategories');

    const handleDelete = (id: number): void => {
        router.delete(route('service-categories.destroy', id));
    };
    const [search, setSearch] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(false);
    const [perPage] = useState(10);
    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/service-categories',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

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

    const columns: ColumnDef<ServiceCategory>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'name', accessorKey: 'name', header: 'اسم الفئة' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const serviceCategory = row.original;
                return (
                    <TableActions
                        item={serviceCategory}
                        routes={{
                            edit: 'service-categories.edit',
                            delete: 'service-categories.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذه الفئة؟"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'فئات الخدمات الطبية ',
            href: route('service-categories.index'),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="فئات الخدمات الطبية" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">
                        فئات الخدمات الطبية
                    </h1>

                    <SearchBar
                        value={search}
                        onChange={handleSearch}
                        showSearch={true}
                        showButton={true}
                        buttonLabel="إضافة فئة"
                        buttonRoute="service-categories.create"
                    />
                    <section className="p-4">
                        <DynamicTable
                            data={[...serviceCategories.data]}
                            columns={columns}
                        />
                    </section>

                    <Pagination
                        links={serviceCategories.links}
                        search={search}
                        perPage={perPage}
                        baseRoute="/service-categories"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
