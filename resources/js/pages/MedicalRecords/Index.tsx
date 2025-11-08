import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
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
    const [search, setSearch] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(true);

    const columns: ColumnDef<MedicalRecord>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        {
            id: 'patient',
            accessorKey: 'patient.name',
            header: 'Patient',
        },
        {
            id: 'doctor',
            accessorKey: 'doctor.name',
            header: 'Doctor',
        },
        {
            id: 'chief_complaint',
            accessorKey: 'chief_complaint',
            header: 'Chief Complaint',
        },
        {
            id: 'actions',
            header: 'Actions',
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
                        confirmMessage="Are you sure you want to delete this medical record?"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

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

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (props.flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [props.flash]);

    const handleDelete = (id: number): void => {
        router.delete(route('medical-records.destroy', id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Medical Records',
            href: route('medical-records.index'),
        },
    ];
    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medical Records" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">Medical Records</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {props.flash?.success || props.flash?.error}
                        </div>
                    )}
                    <div className="mb-4 flex items-center justify-between">
                        <InertiaLink
                            href={route('medical-records.create')}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            <span className="flex items-center gap-1">
                                <i className="material-icons text-lg">add</i>
                                Create Medical Record
                            </span>
                        </InertiaLink>

                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 shadow-sm transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <span className="absolute top-2.5 left-3 text-gray-400">
                                <i className="material-icons text-lg">search</i>
                            </span>
                        </div>
                    </div>

                    <section className="p-6">
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
