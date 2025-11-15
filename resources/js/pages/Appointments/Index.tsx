import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import TableActions from '@/components/TableActionsProps';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Appointment, BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, Link as InertiaLink, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

const StatusBadge = ({ status }: { status: Appointment['status'] }) => {
    const statusClasses = {
        scheduled: 'bg-blue-500',
        completed: 'bg-green-500',
        canceled: 'bg-red-500',
    };
    return (
        <Badge className={`${statusClasses[status]} text-white`}>
            {status}
        </Badge>
    );
};

export default function Index({
    appointments,
    auth,
}: PageProps<{
    appointments: PaginatedData<Appointment>;
    auth: { user: { roles: string[] } };
}>) {
    console.log(appointments, 'appointments.data');
    console.log(auth, 'auth');


    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('appointments.index'),
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
    const columns: ColumnDef<any>[] = [
        { id: 'patient', accessorKey: 'patient.name', header: 'Patient' },
        { id: 'doctor', accessorKey: 'doctor.name', header: 'Doctor' },
        { id: 'service', accessorKey: 'service.name', header: 'service' },
        {
            id: 'appointment_date',
            accessorKey: 'appointment_date',
            header: 'appointment_date',
        },
        { id: 'times', accessorKey: 'times', header: 'Times' },
        { id: 'status', accessorKey: 'status', header: 'Status' },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const appointment = row.original;
                return (
                    <TableActions
                        item={appointment}
                        routes={{
                            edit: 'appointments.edit',
                            delete: 'appointments.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        showDelete={true}
                        confirmMessage="Are you sure you want to delete this appointment?"
                        onDelete={handleDelete}
                    />
                );
            },
        },
    ];

    const handleDelete = (id: number) => {
        router.delete(route('appointments.destroy', id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Appointments',
            href: route('appointments.index'),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointment" />
            <div className="flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">المواعيد</h1>
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        onFocus={(e) => e.target.select()}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 shadow-sm transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="absolute top-2.5 left-3 text-gray-400">
                        <i className="material-icons text-lg">search</i>
                    </span>
                </div>
                <InertiaLink
                    href={route('appointments.create')}
                    className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                >
                    <span className="flex items-center gap-1">
                        <i className="material-icons text-lg">add</i>
                        إضافة موعد
                    </span>
                </InertiaLink>
            </div>
            <div className="overflow-x-auto">
                <section className="p-6">
                    <DynamicTable
                        data={[...appointments.data]}
                        columns={columns}
                    />
                </section>
            </div>
            <Pagination links={appointments.links} />
        </AppLayout>
    );
}
