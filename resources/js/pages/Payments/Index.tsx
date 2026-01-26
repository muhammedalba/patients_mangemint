import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData, Payment } from '@/types';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { route } from 'ziggy-js';






export default function Index() {
    const { payments, } = usePage<{
        payments: PaginatedData<Payment>;
    }>().props;
      const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الدفعات',
            href: route('payments.index'),
        },
    ];
  const [perPage] = useState(10);

    const { handleDelete,isDeleting } = useDeleteAction({
        routeName: 'payments.destroy',
        successMessage: 'تم حذف الدفعة بنجاح',
        successTitle: 'نجاح',
        errorMessage: 'حدث خطأ أثناء حذف الدفعة',
        errorTitle: 'خطأ',
    } );

    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'payments.index',
        initialSearch: '',
        dataKey: 'payments',
    });

    const columns: ColumnDef<Payment>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        {
            accessorKey: 'patient.name',
            header: 'اسم المريض',
        },
        {
            accessorKey: 'amount',
            header: 'قيمة الدفعة',
            cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
            accessorKey: 'payment_date',
            header: 'تاريخ الدفعة',
            cell: ({ row }) => formatDate(row.original.payment_date),
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
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];

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

                        <DynamicTable data={payments?.data} columns={columns} isLoading={isLoading} />
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
