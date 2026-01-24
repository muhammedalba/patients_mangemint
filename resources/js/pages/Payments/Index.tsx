import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData, Payment } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { payments, filters } = usePage<{
        payments: PaginatedData<Payment>;
        auth: { user: { roles: string[] } };
        filters: { search?: string };
    }>().props;
    console.log(payments, 'payments');
    console.log(filters, 'filters');
    const handleDelete = (id: number) => {
        router.delete(route('payments.destroy', id));
    };

    const columns: ColumnDef<Payment>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        {
            accessorKey: 'patient.name',
            header: 'اسم المريض',
        },
        {
            accessorKey: 'amount',
            header: 'قيمة الدفعة',
        },
        {
            accessorKey: 'payment_date',
            header: 'تاريخ الدفعة',
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const payment = row.original;
                return (
                    <TableActions
                        item={payment}
                        routes={{
                            edit: 'payments.edit',
                            delete: 'payments.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={true}
                        confirmMessage="هل أنت متأكد من حذف هذه الدفعة؟"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [perPage] = useState(10);
    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/payments',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('payments.index'),
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
            title: 'الدفعات',
            href: route('payments.index'),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الدفعات" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                   <h1 className="mb-4 text-2xl font-bold">الدفعات</h1>
                     <section className="p-4">
                    <SearchBar
                        value={search}
                        onChange={handleSearch}
                        showSearch={true}
                        showButton={true}
                        buttonLabel="إضافة دفعة"
                        buttonRoute="payments.create"
                    />

                        <DynamicTable data={payments?.data} columns={columns} />
                    </section>
                </div>
                <Pagination
                    links={payments.links}
                    search={search}
                    perPage={perPage}
                    baseRoute="/payments"
                />
            </div>
        </AppLayout>
    );
};
