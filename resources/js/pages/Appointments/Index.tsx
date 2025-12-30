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
        { id: 'patient', accessorKey: 'patient.name', header: 'اسم المريض' },
        { id: 'doctor', accessorKey: 'doctor.name', header: 'اسم الطبيب' },
        { id: 'service', accessorKey: 'service.name', header: 'المعالجة' },
        {
            id: 'date',
            accessorKey: 'date',
            header: 'تاريخ الموعد',
        },
        { id: 'start_time', accessorKey: 'start_time', header: 'بداية الموعد' },
        { id: 'end_time', accessorKey: 'end_time', header: 'نهاية الموعد' },
        { id: 'status', accessorKey: 'status', header: 'حالة الموعد' },
        {
            id: 'actions',
            header: 'الإجراءات',
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
                        confirmMessage="هل انت متأكد من حذف هذا الموعد؟"
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
            title: 'المواعيد',
            href: route('appointments.index'),
        },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المواعيد" />
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
                    data={[...appointments.data]}
                    columns={columns}
                />
            </section>

            <Pagination links={appointments.links} />
        </AppLayout>
    );
}
