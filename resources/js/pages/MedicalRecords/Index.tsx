import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type MedicalRecord } from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { records, auth, flash, filters } = usePage<{
        records: PaginatedData<MedicalRecord>;
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;

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
        if (confirm('هل تريد حذف السجل الطبي؟')) {
            router.delete(route('medicalrecords.destroy', id));
        }
    };
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(route('medicalrecords.index'), { search }, { preserveState: true, replace: true });
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'السجلات الطبية',
            href: route('medicalrecords.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="السجلات الطبية" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">السجلات الطبية</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}
                    <InertiaLink
                        href={route('medicalrecords.create')}
                        className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        إضافة سجل طبي
                    </InertiaLink>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="بحث عن سجل طبي"
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">المريض</th>
                                <th className="border px-2 py-1">الطبيب</th>
                                <th className="border px-2 py-1">التاريخ</th>
                                <th className="border px-2 py-1">التفاصيل</th>
                                <th className="border px-2 py-1">المرفقات</th>
                                <th className="border px-2 py-1">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records?.data?.map((record, i) => (
                                <tr key={record.id}>
                                    <td className="border px-2 py-1">
                                        {i + 1}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {record.patient?.name}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {record.doctor?.name}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {record.date}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {record.details}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {record.attachments}
                                    </td>
                                    <td className="border px-2 py-1">
                                        <InertiaLink
                                            href={route('medicalrecords.edit', record.id)}
                                            className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                        >
                                            تعديل
                                        </InertiaLink>
                                        {userHasDeletePermission && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(record.id)
                                                }
                                                className="rounded bg-red-500 px-2 py-1 text-white"
                                            >
                                                حذف
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination links={records.links} />
                </div>
            </div>
        </AppLayout>
    );
}
