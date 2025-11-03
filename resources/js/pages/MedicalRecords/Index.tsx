import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import {
    PaginatedData,
    type BreadcrumbItem,
    type MedicalRecord,
} from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { records, auth, flash, filters } = usePage<{
        records: PaginatedData<MedicalRecord>;
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;

    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const columns: ColumnDef<any>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        {
            id: 'patient.name',
            accessorKey: 'patient.name',
            header: 'اسم المريض',
        },
        { id: 'doctor.name', accessorKey: 'doctor.name', header: 'اسم الطبيب' },
        { id: 'date', accessorKey: 'date', header: 'التاريخ' },
        { id: 'details', accessorKey: 'details', header: 'ملاحظات' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const records = row.original;
                return (
                    <TableActions
                        item={records}
                        routes={{
                            edit: 'medicalrecords.update',
                            delete: 'medicalrecords.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذا السجل؟"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleDelete = (id: number): void => {
        router.delete(route('medicalrecords.destroy', id));
    };
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('medicalrecords.index'),
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
            title: 'السجلات الطبية',
            href: route('medicalrecords.index'),
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
                            {flash?.success || flash?.error}
                        </div>
                    )}

                    <div className='flex justify-between'>
                        <InertiaLink
                        href={route('medicalrecords.create')}
                        className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        إضافة سجل طبي
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
                            data={[...records.data].reverse()}
                            columns={columns}
                        />
                    </section>
                    <Pagination links={records.links} />
                </div>
            </div>
        </AppLayout>
    );
}
