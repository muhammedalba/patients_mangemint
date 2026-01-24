import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, router } from '@inertiajs/react';
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
    const [search, setSearch] = useState(filters.search || '');
    const [perPage] = useState(10);
    const { success, error } = useAppToast();
    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/teeth',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(
                route('teeth.index'),
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

    const columns: ColumnDef<Teeth>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'patient.name', accessorKey: 'patient.name', header: 'الاسم' },
        {
            id: 'tooth_number',
            accessorKey: 'tooth_number',
            header: ' رقم السن',
        },
        { id: 'status', accessorKey: 'status', header: 'الحالة' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const teeth = row.original;
                return (
                    <TableActions
                        item={teeth}
                        routes={{
                            delete: 'teeth.destroy',
                        }}
                        showEdit={false}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذا السن؟"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    const handleDelete = (id: number): void => {
        router.delete(route('teeth.destroy', id), {
            onSuccess: () => {
                success('تم حذف سن بنجاح');
            },
            onError: () => {
                error('فشل حذف سن، يرجى المحاولة مرة أخرى لاحقًا');
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الأسنان',
            href: route('teeth.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الأسنان" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الأسنان</h1>
                    <section className="p-4">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة سن"
                            buttonRoute="teeth.create"
                        />

                        <DynamicTable
                            data={[...teeth.data]}
                            columns={columns}
                        />
                    </section>
                    <Pagination
                        links={teeth.links}
                        search={search}
                        perPage={perPage}
                        baseRoute="/teeth"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
