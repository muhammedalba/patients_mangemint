import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { type BreadcrumbItem, PageProps, PaginatedData, User } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'المستخدمون',
        href: route('users.index'),
    },
];

export default function Index({
    users,
}: PageProps<{
    users: PaginatedData<User>;
}>) {

    
    const [perPage] = useState(10);
    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'users.index',
        initialSearch: '',
        dataKey: 'users',
    });

    const { handleDelete,isDeleting } = useDeleteAction({
        routeName: 'users.destroy',
        successMessage: 'تم حذف المستخدم بنجاح',
        successTitle: 'تم حذف المستخدم بنجاح',
        errorMessage: 'يرجى التحقق من البيانات المدخلة',
        errorTitle: 'فشل حذف المستخدم',
    });

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
                        confirmMessage="هل أنت متأكد من حذف هذا المستخدم؟"
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];

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
                            isLoading={isLoading}
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
