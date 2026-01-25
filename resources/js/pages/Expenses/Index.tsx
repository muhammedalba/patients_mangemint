import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Expense, PaginatedData } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

type PageProps = {
    expenses: PaginatedData<Expense>;
};

export default function Index() {
    const { expenses } = usePage<PageProps>().props;
    const { success, error } = useAppToast();
    const handleDelete = (id: number) => {
        router.delete(route('expenses.destroy', id), {
            onSuccess: () => {
                success('تم حذف بنجاح','تم حذف مصروف بنجاح');
            },
            onError: () => {
                error('فشل حذف','فشل حذف مصروف، يرجى المحاولة مرة أخرى لاحقًا');
            },
        });
    };
    const columns: ColumnDef<Expense>[] = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'amount', header: 'المبلغ' },
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
                row.original.expense_date ?? row.original.created_at,
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
                    />
                );
            },
        },
    ];
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isFirstMount = useRef(true);
    const [perPage] = useState(10);
    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/expenses',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        const handler = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('expenses.index'),
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
            title: 'المصروفات',
            href: route('expenses.index'),
        },
    ];
    if (isLoading) return <LoadingPage />;

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

                        <DynamicTable data={expenses?.data} columns={columns} />
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
