import { DynamicTable } from '@/components/DynamicTable';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { PaginatedData, ServiceCategory, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { serviceCategories, auth } = usePage<{
        serviceCategories: PaginatedData<ServiceCategory>;
        auth: { user: { roles: string[] } };
      
    }>().props;
    const [perPage] = useState(10);
        const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'فئات الخدمات الطبية ',
            href: route('service-categories.index'),
        },
    ];
    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'service-categories.index',
        initialSearch: '',
        dataKey: 'serviceCategories',
    });

    const { handleDelete, isDeleting } = useDeleteAction({
        routeName: 'service-categories.destroy',
        successMessage: 'تم حذف الفئة بنجاح',
        errorMessage: 'فشل حذف الفئة، يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف الفئة',
    });

    const columns: ColumnDef<ServiceCategory>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID' },
        { id: 'name', accessorKey: 'name', header: 'اسم الفئة' },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => {
                const serviceCategory = row.original;
                return (
                    <TableActions
                        item={serviceCategory}
                        routes={{
                            edit: 'service-categories.edit',
                            delete: 'service-categories.destroy',
                        }}
                        showEdit={true}
                        showView={false}
                        confirmMessage="هل أنت متأكد من حذف هذه الفئة؟"
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="فئات الخدمات الطبية" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">
                        فئات الخدمات الطبية
                    </h1>
                    <section className="p-4">
                        <SearchBar
                            value={search}
                            onChange={handleSearch}
                            showSearch={true}
                            showButton={true}
                            buttonLabel="إضافة فئة"
                            buttonRoute="service-categories.create"
                        />

                        <DynamicTable
                            data={[...serviceCategories.data]}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </section>

                    <Pagination
                        links={serviceCategories.links}
                        search={search}
                        perPage={perPage}
                        baseRoute="/service-categories"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
