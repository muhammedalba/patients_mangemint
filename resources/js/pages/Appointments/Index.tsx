import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { Appointment, BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

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
    const isFirstMount = useRef(true);
    const [perPage] = useState(10);
    const { success, error } = useAppToast();
    const handleSearch = (val: string) => {
        const newValue = val;
        setSearch(newValue);
        router.get(
            '/appointments',
            { search: val, perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
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

    const columns: ColumnDef<Appointment>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'patient', accessorKey: 'patient.name', header: 'اسم المريض' },
        { id: 'doctor', accessorKey: 'doctor.name', header: 'اسم الطبيب' },
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
        router.delete(route('appointments.destroy', id), {
            onSuccess: () => {
                success(" تم حذف  ","تم حذف الموعد بنجاح");
            },
            onError: () => {
                error("فشل حذف الموعد","فشل حذف الموعد، يرجى المحاولة مرة أخرى لاحقًا");
            },
        });
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
            </div>
            <section className="p-4">
                <SearchBar
                    value={search}
                    onChange={handleSearch}
                    showSearch={true}
                    showButton={true}
                    buttonLabel="إضافة موعد"
                    buttonRoute="appointments.create"
                />

                <DynamicTable data={[...appointments.data]} columns={columns} />
            </section>

            <Pagination
                links={appointments.links}
                search={search}
                perPage={perPage}
                baseRoute="/appointments"
            />
        </AppLayout>
    );
}
