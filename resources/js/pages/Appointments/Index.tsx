import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { Appointment, BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { formatDate } from '@/utils/date';




export default function Index({
    appointments,
}: PageProps<{
    appointments: PaginatedData<Appointment>;
    auth: { user: { roles: string[] } };
}>) {

    const [perPage] = useState(10);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'المواعيد',
            href: route('appointments.index'),
        },
    ];

    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'appointments.index',
        initialSearch: '',
        dataKey: 'appointments',
    });

    const { handleDelete ,isDeleting} = useDeleteAction({
        routeName: 'appointments.destroy',
        successTitle: 'تم الحذف بنجاح',
        successMessage: 'تم حذف الموعد بنجاح',
        errorMessage: 'فشل حذف الموعد، يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف الموعد',
    });

    const columns: ColumnDef<Appointment>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'patient', accessorKey: 'patient.name', header: 'اسم المريض' },
        { id: 'doctor', accessorKey: 'doctor.name', header: 'اسم الطبيب' },
        {
            id: 'date',
            accessorKey: 'date',
            header: 'تاريخ الموعد',
            cell: ({ row }) => formatDate(row.original.date),
        },
        { id: 'start_time', accessorKey: 'start_time', header: 'بداية الموعد' },
        { id: 'end_time', accessorKey: 'end_time', header: 'نهاية الموعد' },
        { id: 'status', accessorKey: 'status', header: 'حالة الموعد' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const appointment = row.original;
                return (
                    <TableActions
                        item={appointment}
                        routes={{
                            edit: 'appointments.edit',
                            delete: 'appointments.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={true}
                        confirmMessage="هل انت متأكد من حذف هذا الموعد؟"
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المواعيد" />
            <div className="flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">المواعيد</h1>
            </div>
            <section className="p-4">
                <SearchBar
                    value={search}
                    onChange={handleSearch}
                    showSearch={true}
                    showButton={true}
                    buttonLabel="إضافة موعد"
                    buttonRoute="appointments.create"
                />

                <DynamicTable data={[...appointments.data]} columns={columns} isLoading={isLoading} />
            </section>

            <Pagination
                links={appointments.links}
                search={search}
                perPage={perPage}
                baseRoute="/appointments"
            />
        </AppLayout>
    );
}
