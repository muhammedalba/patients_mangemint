import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem } from '@/types';
import { Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface Procedure {
    id: number;
    name: string;
    description: string | null;
    cost: string;
    tooth_number: string;
}
interface ProcedureResponse {
    data: Procedure[];
}

export default function Index() {
    const { procedures, auth } = usePage<{
        procedures: PaginatedData<ProcedureResponse>;
        auth: { user: { roles: string[] } };
    }>().props;
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
    console.log(procedures, 'procedures');

    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setISLoading] = useState(false);
    const columns: ColumnDef<any>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'patient_name', accessorKey: 'patient', header: 'اسم المريض' },
        { id: 'name', accessorKey: 'name', header: 'اسم المعالجة' },
        { id: 'description', accessorKey: 'description', header: 'الوصف' },
        { id: 'cost', accessorKey: 'cost', header: 'التكلفة' },
        {
            id: 'tooth_number',
            header: 'رقم السن',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <span className="border px-2 py-1">
                        {p.tooth_number}
                    </span>
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
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذا الإجراء؟"
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
        router.delete(route('procedures.destroy', id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Procedures',
            href: route('procedures.index'),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الإجراءات</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {props.flash?.success || props.flash?.error}
                        </div>
                    )}
                    <InertiaLink
                        href={route('procedures.create')}
                        className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        <span className="flex items-center gap-1">
                            <i className="material-icons text-lg">add</i>
                            إضافة إجراء
                        </span>
                    </InertiaLink>
                    <section className="p-6">
                        <DynamicTable
                            data={[...procedures.data]}
                            columns={columns}
                        />
                    </section>
                </div>
                <Pagination links={procedures.links} />
            </div>
        </AppLayout>
    );
}
