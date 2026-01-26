import { ToothIcon } from '@/components/dashboard';
import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, Procedure, type BreadcrumbItem } from '@/types';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';


export default function Index(filters: { search?: string }) {
    const { procedures } = usePage<{
        procedures: PaginatedData<Procedure>;
        filters: { search?: string };
    }>().props;
    const [perPage] = useState(10);
 const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الإجراءات',
            href: route('procedures.index'),
        },
    ];
    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'procedures.index',
        initialSearch: filters.search || '',
        dataKey: 'procedures',
    });

    const { handleDelete, isDeleting } = useDeleteAction({
        routeName: 'procedures.destroy',
        successMessage: 'تم حذف الإجراء بنجاح',
        errorMessage: 'يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف الإجراء',
    });

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
            cell: ({ row }) => formatDate(row.original.processing_date),
        },
        {
            id: 'cost',
            accessorKey: 'cost',
            header: 'التكلفة',
            cell: ({ row }) => formatCurrency(row.original.cost),
        },
        {
            id: 'tooth_id',
            header: 'رقم السن',
            cell: ({ row }) => {
                const p = row.original;
                return (
                   p?.tooth?.tooth_number ? <span className=" relative">
                        <ToothIcon  className="h-8 w-20 text-blue-100 z-0 m-auto"  />
                        <span className="absolute top-1/2 -translate-y-1/2 right-1/2 z-10 font-bold text-center">
                        {p?.tooth?.tooth_number}
                        </span>
                    </span> : <span className="text-gray-500 ">غير محدد</span>
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
                        confirmMessage="هل أنت متأكد من حذف هذا الإجراء؟"
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الإجراءات" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 text-right">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الإجراءات</h1>
                 <section className="p-4">

                    <SearchBar
                        value={search}
                        onChange={handleSearch}
                        showSearch={true}
                        showButton={true}
                        buttonLabel="إضافة إجراء"
                        buttonRoute="procedures.create"
                        className='mb-7'
                    />

                        <DynamicTable
                            data={[...procedures.data]}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </section>
                </div>
                <Pagination links={procedures.links} search={search} perPage={perPage} baseRoute='/procedures' />
            </div>
        </AppLayout>
    );
}
