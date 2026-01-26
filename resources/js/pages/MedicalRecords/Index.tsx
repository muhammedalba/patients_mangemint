import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import {
    type BreadcrumbItem,
    MedicalRecord,
    PageProps,
    PaginatedData,
} from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Index({
    medicalRecords,
    filters,
}: PageProps<{
    medicalRecords: PaginatedData<MedicalRecord>;
    filters: { search?: string };
}>) {
    const [perPage] = useState(10);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'السجلات الطبية',
            href: route('medical-records.index'),
        },
    ];

    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'medical-records.index',
        initialSearch: filters.search || '',
        dataKey: 'medicalRecords',
    });

    const { handleDelete, isDeleting } = useDeleteAction({
        routeName: 'medical-records.destroy',
        successMessage: 'تم حذف السجل بنجاح',
        successTitle: 'تم حذف بنجاح',
        errorMessage: 'فشل حذف السجل يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف',
    });

    const columns: ColumnDef<MedicalRecord>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        {
            id: 'patient',
            accessorKey: 'patient.name',
            header: 'اسم المريض',
        },
        {
            id: 'doctor',
            accessorKey: 'doctor.name',
            header: 'اسم الطبيب',
        },
        {
            id: 'chief_complaint',
            accessorKey: 'chief_complaint',
            header: 'المشكلة الصحية',
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <TableActions
                        item={record}
                        routes={{
                            edit: 'medical-records.edit',
                            delete: 'medical-records.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={true}
                        confirmMessage="هل أنت متأكد من حذف هذا السجل الطبي؟"
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="السجلات الطبية" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">السجلات الطبية</h1>
                    <section className="p-4">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة سجل طبي"
                            buttonRoute="medical-records.create"
                        />

                        <DynamicTable
                            data={medicalRecords.data}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </section>
                    <Pagination
                        links={medicalRecords.links}
                        search={search}
                        perPage={perPage}
                        baseRoute="/medical-records"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
