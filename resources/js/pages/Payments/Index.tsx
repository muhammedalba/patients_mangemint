import { AppShell } from '@/components/app-shell';
import { BreadcrumbItem, PageProps } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
// import { Heading } from '@/components/heading';
import ConfirmDialog from '@/components/ConfirmDialog';
import { DynamicTable } from '@/components/DynamicTable';
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
const Index: React.FC<IndexProps> = ({ auth, payments }) => {
    console.log(payments, 'payments');

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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Payments',
            href: route('payments.index'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <AppShell user={auth.user}>
                <Head title="Payments" />
                <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h1>All Payments</h1>
                        <Link href={route('payments.create')}>
                            <Button>Add Payment</Button>
                        </Link>
                    </div>
                    <DynamicTable data={payments} columns={columns} />
                </div>
            </AppShell>
        </AppLayout>
    );
};

export default Index;
