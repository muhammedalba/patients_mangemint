import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';

type MonthClosures = {
    id: number;
    year: number;
    month: number;
    closed_at: string;
};
export default function Index() {
    const { closures, flash } = usePage<any>().props;
    console.log(closures);
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const handleDelete = (id: number) => {
        if (confirm('Delete this month closure?')) {
            router.delete(route('month-closures.destroy', id));
        }
    };
    const columns: ColumnDef<MonthClosures>[] = [
        { accessorKey: 'id', header: 'المعرف' },
        { accessorKey: 'year', header: 'السنة' },
        {
            accessorKey: 'month',
            header: 'الشهر',
        },
        {
            accessorKey: 'closed_at',
            header: 'أُغلقَ في',
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
                            delete: 'expense-categories.destroy',
                        }}
                        showEdit={false}
                        showView={false}
                        showDelete={true}
                        confirmMessage="هل أنت متأكد من حذف هذا العنصر؟"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: ' إغلاق الشهر',
            href: route('month-closures.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إغلاق الشهر" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {showToast && (
                    <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                        {flash?.success || flash?.error}
                    </div>
                )}
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold"> إغلاق الشهر</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}
                    <a
                        href={route('month-closures.close')}
                        className="btn btn-primary rounded-2xl p-4 text-white border bg-blue-600"
                    >
                        إغلاق الشهر
                    </a>
                </div>
                <section className="p-4">
                    <DynamicTable data={closures?.data} columns={columns} />
                </section>


                <div className="mt-4">
                    <Pagination links={closures.links} />
                </div>
            </div>
        </AppLayout>
    );
}
