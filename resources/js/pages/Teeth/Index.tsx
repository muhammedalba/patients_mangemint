import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';

export interface Teeth {
    id: number;
    patient: { id: number; name: string };
    patient_id: number;
    tooth_number: string;
    status: string;
    notes: string;
}

export default function Index({
    teeth,
}: PageProps<{
    teeth: PaginatedData<Teeth>;
}>) {
    const [perPage] = useState(10);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الأسنان',
            href: route('teeth.index'),
        },
    ];
    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'teeth.index',
        initialSearch:'',
        dataKey: 'teeth',
    });

    const { handleDelete, isDeleting } = useDeleteAction({
        routeName: 'teeth.destroy',
        successMessage: 'تم حذف السن بنجاح',
        successTitle: 'تم حذف بنجاح',
        errorMessage: 'فشل حذف السن، يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف',
    });

    const columns: ColumnDef<Teeth>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'patient.name', accessorKey: 'patient.name', header: 'الاسم' },
        {
            id: 'tooth_number',
            accessorKey: 'tooth_number',
            header: ' رقم السن',
        },
        { id: 'status', accessorKey: 'status', header: 'الحالة' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const teeth = row.original;
                return (
                    <TableActions
                        item={teeth}
                        routes={{
                            delete: 'teeth.destroy',
                        }}
                        showEdit={false}
                        showView={false}
                        confirmMessage="هل أنت متأكد من حذف هذا السن؟"
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];




    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الأسنان" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الأسنان</h1>
                    <section className="p-4">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة سن"
                            buttonRoute="teeth.create"
                        />

                        <DynamicTable
                            data={[...teeth.data]}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </section>
                    <Pagination
                        links={teeth.links}
                        search={search}
                        perPage={perPage}
                        baseRoute="/teeth"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
