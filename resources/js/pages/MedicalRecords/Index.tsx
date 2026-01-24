import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    MedicalRecord,
    PageProps,
    PaginatedData,
} from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index({
    medicalRecords,
    filters,
}: PageProps<{
    medicalRecords: PaginatedData<MedicalRecord>;
    filters: { search?: string };
}>) {
    const [search, setSearch] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(true);
    const [perPage] = useState(10);
      const { success, error } = useAppToast();
    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/medical-records',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDelete = (id: number): void => {
        router.delete(route('medical-records.destroy', id),{
             onSuccess: () => {
                success('تم حذف السجل  بنجاح');
            },
            onError: () => {
                error('فشل حذف السجل يرجى المحاولة مرة أخرى لاحقًا');
            },
        });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('medical-records.index'),
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
                    />
                );
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'السجلات الطبية',
            href: route('medical-records.index'),
        },
    ];
    if (isLoading) return <LoadingPage />;
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
