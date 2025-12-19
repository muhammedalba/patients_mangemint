import { BreadcrumbItem, PageProps } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
// import { Heading } from '@/components/heading';
import ConfirmDialog from '@/components/ConfirmDialog';
import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Payment } from '@/types/payment';
import { ColumnDef } from '@tanstack/react-table';
import { route } from 'ziggy-js';
interface IndexProps extends PageProps {
    payments: {
        data: Payment[];
    };
}

const Index: React.FC<IndexProps> = () => {
    const { payments, flash, filters } = usePage<{
        payments: any[];
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;
    console.log(payments, 'payments');
    console.log(filters, 'filters');
    console.log(flash, 'flash');

    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: 'patient.name',
            header: 'Patient',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
        },
        {
            accessorKey: 'payment_date',
            header: 'Payment Date',
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Link href={route('payments.edit', row.original.id)}>
                        <Button variant="outline">Edit</Button>
                    </Link>
                    <ConfirmDialog
                        onConfirm={() =>
                            Inertia.delete(
                                route('payments.destroy', row.original.id),
                            )
                        }
                        title="Delete Payment"
                        description="Are you sure you want to delete this payment? This action cannot be undone."
                    >
                        <Button variant="destructive">Delete</Button>
                    </ConfirmDialog>
                </div>
            ),
        },
    ];
    const [showToast, setShowToast] = useState(false);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الدفعات',
            href: route('payments.index'),
        },
    ];
    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('payments.index'),
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

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الدفعات" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>

            {showToast && (
                <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                    {flash?.success || flash?.error}
                </div>
            )}

                    <h1 className="mb-4 text-2xl font-bold">الدفعات</h1>
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
                        buttonLabel="إضافة دفعة"
                        buttonRoute="payments.create"
                    />

                    <section className="p-4">
                        <DynamicTable data={payments?.data} columns={columns} />
                    </section>
                </div>
                <Pagination links={payments?.links} />
            </div>
        </AppLayout>
    );
};

export default Index;
