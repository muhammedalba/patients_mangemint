import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export interface User {
    id: number;
    name: number;
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
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(
                route('users.index'),
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
        if (confirm('هل تريد حذف المستخدم؟')) {
            router.delete(route('users.destroy', id));
        }
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'users',
            href: route('users.index'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="uesrs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">Users</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {props.flash?.success || props.flash?.error}
                        </div>
                    )}
                    <div className="mb-4 flex items-center justify-between">
                        <InertiaLink
                            href={route('users.create')}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            <span className="flex items-center gap-1">
                                Add User
                                <i className="material-icons text-lg">add</i>
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
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">Name</th>
                                <th className="border px-2 py-1">Email</th>
                                <th className="border px-2 py-1">Role</th>
                                <th className="border px-2 py-1">Phone</th>
                                <th className="border px-2 py-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.data.map((u, i) => (
                                <tr key={u.id}>
                                    <td className="border px-2 py-1 text-center">
                                        {i + 1}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {u.name}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {u.email}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {u.roles.join(', ')}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {u.phone}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        <InertiaLink
                                            href={route('users.edit', u.id)}
                                            className="mr-2 font-bold text-gray-700"
                                        >
                                            <i className="material-icons">
                                                edit
                                            </i>
                                        </InertiaLink>

                                        {userHasDeletePermission && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(u.id)
                                                }
                                                className="mr-2 font-bold text-red-500"
                                            >
                                                <i className="material-icons">
                                                    delete
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination links={users.links} />
                </div>
            </div>
        </AppLayout>
    );
}
