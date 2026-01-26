import { DynamicTable } from '@/components/DynamicTable';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Service } from '@/types';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';

import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/utils/currency';

export default function Index() {
    const { services, auth } = usePage<{
        services: PaginatedData<Service>;
        auth: { user: { roles: string[] } };
      
    }>().props;


    const [perPage] = useState(10);

    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الخدمات الطبية',
            href: route('services.index'),
        },
    ];

    const { handleDelete, isDeleting } = useDeleteAction({
        routeName: 'services.destroy',
        successMessage: 'تم حذف الخدمة بنجاح',
        errorMessage: 'فشل حذف الخدمة، يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف الخدمة',
    });

    const columns: ColumnDef<Service>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'category', accessorKey: 'category', header: '  الفئة' },
        { id: 'name', accessorKey: 'name', header: ' اسم الخدمة' },
        {
            id: 'price',
            accessorKey: 'price',
            header: 'التكلفة',
            cell: ({ row }) => formatCurrency(row.original.price),
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const services = row.original;
                return (
                    <TableActions
                        item={services}
                        routes={{
                            edit: 'services.edit',
                            delete: 'services.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        confirmMessage="هل أنت متأكد من حذف هذه الخدمة"
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];

    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'services.index',
        initialSearch: '',
        dataKey: 'services',
    });



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الخدمات الطبية" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الخدمات الطبية</h1>
                    <section className="p-4">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة خدمة"
                            buttonRoute="services.create"
                        />

                        <DynamicTable
                            data={[...services.data]}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </section>
                </div>
                <Pagination
                    links={services.links}
                    search={search}
                    perPage={perPage}
                    baseRoute="/services"
                />
            </div>
        </AppLayout>
    );
}
