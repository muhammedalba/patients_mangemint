import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
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
console.log(teeth.data);

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

    const columns: ColumnDef<Teeth>[] = [
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
                            edit: 'tooth.edit',
                            delete: 'tooth.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذا السن؟"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الأسنان',
            href: route('tooth.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الأسنان" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الأسنان</h1>
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
                        buttonLabel="إضافة سن"
                        buttonRoute="tooth.create"
                    />

                    <section className="p-4">
                        <DynamicTable
                            data={[...teeth.data]}
                            columns={columns}
                        />
                    </section>
                    <Pagination links={teeth.links} />
                </div>
            </div>
        </AppLayout>
    );
}
