import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData, User } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'المستخدمون',
        href: route('users.index'),
    },
];
export default function Index({
    users,
    auth,
    filters,
}: PageProps<{
    users: PaginatedData<User>;
    auth: { user: { roles: string[] } };
    filters: { search?: string };
}>) {
    const [search, setSearch] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(true);
     const { success, error } = useAppToast();
    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const [perPage] = useState(10);

    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/users',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    const columns: ColumnDef<User>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'name', accessorKey: 'name', header: 'الاسم' },
        { id: 'email', accessorKey: 'email', header: 'البريد الإلكتروني' },
        {
            id: 'roles',
            accessorKey: 'roles',
            header: 'الدور',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    {row.original.roles.map((role) => (
                        <span key={role.id} className="badge">
                            {role.name}
                        </span>
                    ))}
                </div>
            ),
        },

        { id: 'phone', accessorKey: 'phone', header: 'الهاتف' },
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

    const handleDelete = (id: number): void => {
        router.delete(route('users.destroy', id),{
            onSuccess: () => {
                success('تم حذف المستخدم بنجاح');
            },
            onError: () => {
                error('فشل حذف المستخدم', 'يرجى المحاولة مرة أخرى لاحقًا');
            },
        });
    };

    if (isLoading) return <LoadingPage />;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المستخدمون" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 text-right">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">المستخدمون</h1>
                    <section className="p-4 pt-0">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة مستخدم"
                            buttonRoute="users.create"
                            className='mb-7'
                        />
                        {/* table data*/}

                        <DynamicTable
                            data={[...users.data]}
                            columns={columns}
                        />
                    </section>

                    <Pagination
                        links={users.links}
                        search={search}
                        perPage={perPage}
                        baseRoute="/users"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
