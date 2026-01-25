import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ExpenseCategory, PaginatedData } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

type PageProps = {
  categories: PaginatedData<ExpenseCategory>;
};

export default function Index() {
    const { categories } = usePage<PageProps>().props;
    const { success, error } = useAppToast();
    const handleDelete = (id: number) => {
        router.delete(route('expense-categories.destroy', id),{
             onSuccess: () => {
                success('تم  بنجاح','تم حذف الفئة بنجاح');
            },
            onError: () => {
                error('فشل حذف الفئة','فشل حذف الفئة، يرجى المحاولة مرة أخرى لاحقًا');
            },
        });
    };
    const columns: ColumnDef<ExpenseCategory>[] = [
        { accessorKey: 'id', header: 'المعرف' },
        { accessorKey: 'name', header: 'اسم الفئة' },
        {
            accessorKey: 'type',
            header: 'الفئة',
            cell: ({ row }) => row.original.type ?? '-',
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <TableActions
                        item={category}
                        routes={{
                            edit: 'expense-categories.edit',
                            delete: 'expense-categories.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={true}
                        confirmMessage="هل أنت متأكد من حذف هذه الفئة"
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
            '/expense-categories',
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
                route('expense-categories.index'),
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
            title: 'فئات المصروفات',
            href: route('expense-categories.index'),
        },
    ];
    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="فئات المصروفات" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">فئات المصروفات</h1>

                    <section className="p-4">
                    <SearchBar
                        value={search}
                        onChange={handleSearch}
                        showSearch={true}
                        showButton={true}
                        buttonLabel="إضافة فئة المصروف"
                        buttonRoute="expense-categories.create"
                    />


                        <DynamicTable
                            data={categories?.data}
                            columns={columns}
                        />
                    </section>
                </div>
                <Pagination
                    links={categories.links}
                    search={search}
                    perPage={perPage}
                    baseRoute="/expense-categories"
                />
            </div>
        </AppLayout>
    );
}
