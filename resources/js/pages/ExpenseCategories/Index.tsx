import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

type ExpenseCategory = {
    id: number;
    name: string;
    type: string;
}
export default function Index() {
    const { categories, flash } = usePage<any>().props;

    const handleDelete = (id: number) => {
            router.delete(route('expense-categories.destroy', id));
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
        const [showToast, setShowToast] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        useEffect(() => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="فئات المصروفات" />
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                        <div>
                        {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}
                            <h1 className="mb-4 text-2xl font-bold">فئات المصروفات</h1>
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
                                buttonLabel="إضافة فئة المصروف"
                                buttonRoute="expense-categories.create"
                            />

                            <section className="p-4">
                                <DynamicTable data={categories?.data} columns={columns} />
                            </section>
                        </div>
                        <Pagination links={categories?.links} />
                    </div>
                </AppLayout>
    );
}
