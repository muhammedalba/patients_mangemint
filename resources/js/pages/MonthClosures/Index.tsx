import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    MonthClosures,
    PageProps,
    PaginatedData,
} from '@/types';

import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Index({
    closures,
}: PageProps<{
    closures: PaginatedData<MonthClosures>;
}>) {

    const [perPage] = useState(10);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: ' إغلاق الشهر',
            href: route('month-closures.index'),
        },
    ];

    const { handleDelete, isDeleting } = useDeleteAction({
        routeName: 'month-closures.destroy',
        successMessage: 'تم حذف الشهر بنجاح',
        successTitle: 'تم حذف بنجاح',
        errorMessage: 'فشل حذف الشهر يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف',
    });

    const { handleSearch, search, isLoading } = useSearchFilter({
        routeName: 'month-closures.index',
        initialSearch:'',
        dataKey: 'closures',
    });
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
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إغلاق الشهر" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold"> إغلاق الشهر</h1>
                    <section className="p-4">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة إغلاق شهر"
                            buttonRoute="month-closures.close"
                        />

                        <DynamicTable data={closures?.data} columns={columns} isLoading={isLoading} />
                    </section>
                </div>

                <div className="mt-4">
                    <Pagination
                        links={closures.links}
                        search={search}
                        perPage={perPage}
                        baseRoute="/month-closures"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
