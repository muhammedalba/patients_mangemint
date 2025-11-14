import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Appointment, BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);
    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const columns: ColumnDef<any>[] = [
        { id: 'patient', accessorKey: 'patient', header: 'Patient' },
        { id: 'doctor', accessorKey: 'doctor', header: 'Doctor' },
        { id: 'procedure', accessorKey: 'procedure', header: 'Procedure' },
        { id: 'date', accessorKey: 'date', header: 'Date' },
        { id: 'time', accessorKey: 'time', header: 'Time' },
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
                        showDelete={userHasDeletePermission}
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

                <SearchBar
                    value={''}
                    onChange={() => {}}
                    showSearch={true}
                    showButton={true}
                    buttonLabel="إضافة موعد"
                    buttonRoute="appointments.create"
                />
            </div>

            <section className="p-4">
                <DynamicTable
                    data={[...appointments.data].reverse()}
                    columns={columns}
                />
            </section>

            <Pagination links={appointments.links} />
        </AppLayout>
    );
}
