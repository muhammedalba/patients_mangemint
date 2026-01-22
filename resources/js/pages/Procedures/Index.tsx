import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, Procedure, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';


export default function Index(filters: { search?: string }) {
    const { procedures, auth } = usePage<{
        procedures: PaginatedData<Procedure>;
        auth: { user: { roles: string[] } };
        filters: { search?: string };
    }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const [isLoading, setIsLoading] = useState(true);
    const [perPage] = useState(10);
    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/procedures',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    const columns: ColumnDef<Procedure>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        {
            id: 'patient_name',
            accessorKey: 'patient.name',
            header: 'اسم المريض',
        },
        { id: 'name', accessorKey: 'name', header: 'اسم المعالجة' },
        {
            id: 'processing_date',
            accessorKey: 'processing_date',
            header: 'تاريخ المعالجة',
            cell: ({ row }) =>
                new Date(row.original.processing_date).toLocaleDateString(
                    'en-SY',
                ),
        },
        { id: 'cost', accessorKey: 'cost', header: 'التكلفة' },
        {
            id: 'tooth_id',
            header: 'رقم السن',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <span className="border px-2 py-1">
                        {p?.tooth?.tooth_number}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const procedure = row.original;
                return (
                    <TableActions
                        item={procedure}
                        routes={{
                            edit: 'procedures.edit',
                            delete: 'procedures.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذا الإجراء؟"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];
    const handleDelete = (id: number): void => {
        router.delete(route('procedures.destroy', id));
    };
    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);

            router.get(
                route('procedures.index'),
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
            title: 'الإجراءات',
            href: route('procedures.index'),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الإجراءات" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 text-right">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الإجراءات</h1>
                    <SearchBar
                        value={search}
                        onChange={handleSearch}
                        showSearch={true}
                        showButton={true}
                        buttonLabel="إضافة إجراء"
                        buttonRoute="procedures.create"
                    />

                    <section className="p-4">
                        <DynamicTable
                            data={[...procedures.data]}
                            columns={columns}
                        />
                    </section>
                </div>
                <Pagination links={procedures.links} search={search} perPage={perPage} baseRoute='/procedures' />
            </div>
        </AppLayout>
    );
}
