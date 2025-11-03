import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
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
    auth,
    filters,
}: PageProps<{
    teeth: PaginatedData<Teeth>;
    auth: { user: { roles: string[] } };
    filters: { search?: string };
}>) {
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(
                route('tooth.index'),
                { search },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const [showToast, setShowToast] = useState(false);
    const columns: ColumnDef<any>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'patient.name', accessorKey: 'patient.name', header: 'الاسم' },
        {
            id: 'tooth_number',
            accessorKey: 'tooth_number',
            header: ' رقم السن',
        },
        { id: 'status', accessorKey: 'status', header: 'الحالة' },
        { id: 'notes', accessorKey: 'notes', header: 'ملاحظات' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const teeth = row.original;
                return (
                    <TableActions
                        item={teeth}
                        routes={{
                            edit: 'users.edit',
                            delete: 'users.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="Are you sure you want to delete this teeth?"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    useEffect(() => {
        if (props.flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [props.flash]);

    const handleDelete = (id: number): void => {
        router.delete(route('tooth.destroy', id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teeth',
            href: route('tooth.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teeth" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الأسنان</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {props.flash?.success || props.flash?.error}
                        </div>
                    )}
                    <div className="mb-4 flex items-center justify-between">
                        <InertiaLink
                            href={route('tooth.create')}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            <span className="flex items-center gap-1">
                                <i className="material-icons text-lg">add</i>
                                إضافة سن
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
                            data={[...teeth.data].reverse()}
                            columns={columns}
                        />
                    </section>
                    <Pagination links={teeth.links} />
                </div>
            </div>
        </AppLayout>
    );
}
