import { DynamicTable } from '@/components/DynamicTable';
import { IconTooltip } from '@/components/IconToolTip';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    phone: string;
}
export default function Index({
    users,
    auth,
    filters,
}: PageProps<{
    users: PaginatedData<User>;
    auth: { user: { roles: string[] } };
    filters: { search?: string };
}>) {
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
    console.log(props.flash,'props');
// console.log(users,'users');

    const [search, setSearch] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );

    const columns: ColumnDef<User>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'name', accessorKey: 'name', header: 'الاسم' },
        { id: 'email', accessorKey: 'email', header: 'البريد الإلكتروني' },
        {
            id: 'roles',
            accessorKey: 'roles',
            header: 'الأدوار',
            cell: ({ row }) => {
                const roles: string[] = row.original.roles;
                return <span>{roles.join(', ')}</span>;
            },
        },
        {
            id: 'phone',
            header: 'الهاتف',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <td className="justify-between gap-1 border px-1 py-1 text-center">
                        {p.phone && (
                            <>
                                <a
                                    href={`tel:${p.phone}`}
                                    className="inline-block"
                                    title="Call"
                                >
                                    <IconTooltip label={`${p.phone}`}>
                                        <i className="material-icons text-xs leading-none font-bold text-green-500">
                                            phone_enabled
                                        </i>
                                    </IconTooltip>
                                </a>
                            </>
                        )}
                    </td>
                );
            },
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <TableActions
                        item={user}
                        routes={{
                            edit: 'users.edit',
                            delete: 'users.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذا المستخدم؟"
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
                route('users.index'),
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
        if (props.flash?.success || props.flash?.error) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [props.flash]);

    const handleDelete = (id: number): void => {
        router.delete(route('users.destroy', id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'المستخدمون',
            href: route('users.index'),
        },
    ];

    if (isLoading) return <LoadingPage />;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 text-right">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">المستخدمون</h1>
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
                        buttonLabel="إضافة مستخدم"
                        buttonRoute="users.create"
                    />

                    <section className="p-4">
                        <DynamicTable
                            data={[...users.data]}
                            columns={columns}
                        />
                    </section>
                    <Pagination links={users.links} />
                </div>
            </div>
        </AppLayout>
    );
}
