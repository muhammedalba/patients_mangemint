import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export interface MedicalRecord {
    id: number;
    patient: { name: string };
    doctor: { name: string };
    chief_complaint: string;
}

export default function Index({
    medicalRecords,
    auth,
    filters,
}: PageProps<{
    medicalRecords: PaginatedData<MedicalRecord>;
    auth: { user: { roles: string[] } };
    filters: { search?: string };
}>) {
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
    console.log(medicalRecords,'medicalRecords');

    const [search, setSearch] = useState(filters.search || '');
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleDelete = (id: number): void => {
        router.delete(route('medical-records.destroy', id));
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

    useEffect(() => {
        if (props.flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [props.flash]);

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
                            show: 'medical-records.show',
                        }}
                        showEdit={true}
                        showView={true}
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
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {props.flash?.success || props.flash?.error}
                        </div>
                    )}

                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        showSearch={true}
                        showButton={true}
                        buttonLabel="إضافة سجل طبي"
                        buttonRoute="medical-records.create"
                    />

                    <section className="p-4">
                        <DynamicTable
                            data={medicalRecords.data}
                            columns={columns}
                        />
                    </section>
                    <Pagination links={medicalRecords.links} />
                </div>
            </div>
        </AppLayout>
    );
}
