import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { BreadcrumbItem, Expense, PaginatedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

type PageProps = {
    expenses: PaginatedData<Expense>;
};

export default function Index() {
    const { expenses } = usePage<PageProps>().props;
    const [perPage] = useState(10);
   const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'المصروفات',
            href: route('expenses.index'),
        },
    ];

    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'expenses.index',
        initialSearch: '',
        dataKey: 'expenses',
    });

    const { handleDelete, isDeleting } = useDeleteAction({
        routeName: 'expenses.destroy',
        successMessage: 'تم حذف مصروف بنجاح',
        errorMessage: 'فشل حذف مصروف، يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف',
    });
    const columns: ColumnDef<Expense>[] = [
        { accessorKey: 'id', header: 'ID' },
        {
            accessorKey: 'amount',
            header: 'المبلغ',
            cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
            accessorKey: 'category.name',
            header: 'الفئة',
            cell: ({ row }) => row.original.category?.name ?? '-',
        },
        { accessorKey: 'payment_method', header: 'طريقة الدفع' },
        {
            accessorKey: 'expense_date',
            header: 'تاريخ المصروف',
            cell: ({ row }) =>
                formatDate(row.original.expense_date ?? row.original.created_at),
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const expense = row.original;
                return (
                    <TableActions
                        item={expense}
                        routes={{
                            edit: 'expenses.edit',
                            delete: 'expenses.destroy',
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
            <Head title="المصروفات" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">المصروفات</h1>
                    <section className="p-4">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة مصروف"
                            buttonRoute="expenses.create"
                        />

                        <DynamicTable data={expenses?.data} columns={columns} isLoading={isLoading} />
                    </section>
                </div>
                <Pagination
                    links={expenses.links}
                    search={search}
                    perPage={perPage}
                    baseRoute="/expenses"
                />
            </div>
        </AppLayout>
    );
}
