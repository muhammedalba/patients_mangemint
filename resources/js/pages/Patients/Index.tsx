import { DynamicTable } from '@/components/DynamicTable';
import { IconTooltip } from '@/components/IconToolTip';
import LoadingPage from '@/components/LoadingPage';
import Pagination from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import TableActions from '@/components/TableActionsProps';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Patient } from '@/types';
import { useAppToast } from '@/utils/toast';
import { useDeleteAction } from '@/hooks/use-delete-action';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Info, Mail, MessageCircle, Phone } from 'lucide-react';
import { useMemo, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { patients } = usePage<{
        patients: PaginatedData<Patient>;
    }>().props;

    const [perPage] = useState(10);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
    ];
    const { search, handleSearch, isLoading } = useSearchFilter({
        routeName: 'patients.index',
        initialSearch:'',
        dataKey: 'patients',
    });

    const { handleDelete, isDeleting } = useDeleteAction({
        routeName: 'patients.destroy',
        successMessage: 'تم حذف المريض بنجاح',
        errorMessage: 'يرجى المحاولة مرة أخرى لاحقًا',
        errorTitle: 'فشل حذف المريض',
    });



const columns: ColumnDef<Patient>[] = useMemo(() => [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'name', header: 'الاسم الكامل' },
        {
            id: 'age',
            header: 'العمر',
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div className="px-2 py-1 text-start">
                        {new Date().getFullYear() -
                            new Date(p.birth_date).getFullYear()}{' '}
                        سنة
                    </div>
                );
            },
        },
        { accessorKey: 'gender', header: 'الجنس' },
        {
            accessorKey: 'marital_status',
            header: 'الحالة الاجتماعية',
        },
        {
    id: 'contact',
    header: 'التواصل',
    cell: ({ row }) => {
        const p = row.original;
        const hasContact = Boolean(p.phone || p.email);

        return (
            <div className="flex items-start gap-3 px-2 py-1 text-center">
                {p.phone && (
                    <>
                        <a href={`tel:${p.phone}`}>
                            <IconTooltip label={p.phone}>
                                <Phone size={18} className=" text-slate-600 hover:text-indigo-600 transition-colors" />
                            </IconTooltip>
                        </a>

                        <a
                            href={`https://wa.me/${p.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <IconTooltip label={`WhatsApp: ${p.phone}`}>
                                <MessageCircle size={18} className=" text-emerald-500 hover:text-emerald-600 transition-colors" />
                            </IconTooltip>
                        </a>
                    </>
                )}

                {p.email && (
                    <a href={`mailto:${p.email}`}>
                        <IconTooltip label={p.email}>
                            <Mail size={18} className=" text-blue-500 hover:text-blue-600 transition-colors" />
                        </IconTooltip>
                    </a>
                )}

                {!hasContact && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Info size={18} className=" text-slate-600 hover:text-indigo-600 transition-colors" />
                        <span>لا توجد وسيلة تواصل</span>
                    </div>
                )}
            </div>
        );
    },
}
,
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => (
                <TableActions
                    item={row.original}
                    routes={{
                        edit: 'patients.edit',
                        view: 'patients.details',
                        delete: 'patients.destroy',
                    }}
                    confirmMessage="هل أنت متأكد من حذف هذا المريض؟"
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />
            ),
        },
    ], []);



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المرضى" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">المرضى</h1>

                <SearchBar
                    value={search}
                    onChange={handleSearch}
                    showSearch
                    showButton
                    buttonLabel="إضافة مريض"
                    buttonRoute="patients.create"
                    className="mb-7"
                />

                <DynamicTable
                    data={patients.data}
                    columns={columns}
                    isLoading={isLoading}
                />

                <Pagination
                    links={patients.links}
                    search={search}
                    perPage={perPage}
                    baseRoute="/patients"
                />
            </div>
        </AppLayout>
    );
}
