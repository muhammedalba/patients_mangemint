import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Patient } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { patients, auth, flash, filters } = usePage<{
        patients: PaginatedData<Patient>;
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;
    console.log(patients, 'patients');

    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleDelete = (id: number): void => {
        router.delete(route('patients.destroy', id));
    };
    const [search, setSearch] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('patients.index'),
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
            title: 'Patients',
            href: route('patients.index'),
        },
    ];

    const columns: ColumnDef<any>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'name', accessorKey: 'name', header: 'Full Name' },
        {
            id: 'age',
            header: 'Age',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <td className="border px-2 py-1 text-center">
                        {getAgeFromBirthDate(p.birth_date)} سنة
                    </td>
                );
            },
        },
        {
            id: 'contact',
            header: 'Contact',
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
                                    <i className="material-icons text-xs leading-none font-bold text-gray-700">
                                        phone_enabled
                                    </i>
                                </a>
                                <a
                                    href={`https://wa.me/${p.phone}`}
                                    className="ml-4 inline-block"
                                    title="WhatsApp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fab fa-whatsapp text-2xl leading-none text-green-500"></i>
                                </a>
                            </>
                        )}

                        {p.email && (
                            <a
                                href={`mailto:${p.email}`}
                                className="ml-4 inline-block"
                                title="Email"
                            >
                                <i className="material-icons text-xs leading-none font-bold text-blue-500">
                                    email
                                </i>
                            </a>
                        )}
                    </td>
                );
            },
        },
        { id: 'gender', accessorKey: 'gender', header: 'Gender' },
        {
            id: 'marital_status',
            accessorKey: 'marital_status',
            header: 'Marital status',
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const patient = row.original;
                return (
                    <TableActions
                        item={patient}
                        routes={{
                            edit: 'patients.edit',
                            view: 'patients.details',
                            delete: 'patients.destroy',
                        }}
                        showEdit={true}
                        showView={true}
                        showDelete={userHasDeletePermission}
                        confirmMessage="هل أنت متأكد من حذف هذا المريض؟"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    const getAgeFromBirthDate = (birthDate: string): number =>
        new Date().getFullYear() - new Date(birthDate).getFullYear();

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="patients" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">المرضى</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}
                    <div className="mb-4 flex items-center justify-between">
                        <Link
                            href={route('patients.create')}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            <span className="flex items-center gap-1">
                                <i className="material-icons text-lg">add</i>
                                إضافة مريض
                            </span>
                        </Link>
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
                            data={[...patients.data].reverse()}
                            columns={columns}
                        />
                    </section>

                    <Pagination links={patients.links} />
                </div>
            </div>
        </AppLayout>
    );
}
