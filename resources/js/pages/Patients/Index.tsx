import { DynamicTable } from '@/components/DynamicTable';
import { IconTooltip } from '@/components/IconToolTip';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Patient } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { patients, auth, flash, filters, genders, marital_statuses } =
        usePage<{
            patients: PaginatedData<Patient>;
            auth: { user: { roles: string[] } };
            flash: { success?: string; error?: string };
            filters: { search?: string };
        }>().props;
    console.log(patients, 'patients');
    console.log(genders, 'genders');
    console.log(marital_statuses, 'marital_statuses');

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
    const getAgeFromBirthDate = (birthDate: string): number =>
        new Date().getFullYear() - new Date(birthDate).getFullYear();

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

    const columns: ColumnDef<Patient>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'name', accessorKey: 'name', header: 'الاسم الكامل' },
        {
            id: 'age',
            header: 'العمر',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div className="border px-2 py-1 text-center">
                        {getAgeFromBirthDate(p.birth_date)} سنة
                    </div>
                );
            },
        },
        { id: 'gender', accessorKey: 'gender', header: 'الجنس' },
        {
            id: 'marital_status',
            accessorKey: 'marital_status',
            header: 'الحالة الاجتماعية',
        },
        {
            id: 'contact',
            header: 'التواصل',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div className="justify-between gap-1 border px-1 py-1 text-center">
                        {p.phone && (
                            <>
                                <a
                                    href={`tel:${p.phone}`}
                                    className="inline-block"
                                    title="Call"
                                >
                                    <IconTooltip label={`${p.phone}`}>
                                        <i className="material-icons text-xs leading-none font-bold text-gray-700">
                                            phone_enabled
                                        </i>
                                    </IconTooltip>
                                </a>
                                <a
                                    href={`https://wa.me/${p.phone}`}
                                    className="mr-2 inline-block"
                                    title="WhatsApp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <IconTooltip label={`${p.phone}`}>
                                        <i className="fab fa-whatsapp text-2xl leading-none text-green-500"></i>
                                    </IconTooltip>
                                </a>
                            </>
                        )}

                        {p.email && (
                            <a
                                href={`mailto:${p.email}`}
                                className="mr-2 inline-block"
                                title="Email"
                            >
                                <IconTooltip label={`${p.email}`}>
                                    <i className="material-icons text-xs leading-none font-bold text-blue-500">
                                        email
                                    </i>
                                </IconTooltip>
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'الإجراءات',
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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'المرضى',
            href: route('patients.index'),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المرضى" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">المرضى</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}

                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        showSearch={true}
                        showButton={true}
                        buttonLabel="إضافة مريض"
                        buttonRoute="patients.create"
                    />
                    <section className="p-4">
                        <DynamicTable
                            data={[...patients.data]}
                            columns={columns}
                        />
                    </section>

                    <Pagination links={patients.links} />
                </div>
            </div>
        </AppLayout>
    );
}
