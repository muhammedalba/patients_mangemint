import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Patient } from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';


export default function Index() {
    const { patients, auth, flash, filters } = usePage<{
        patients:  PaginatedData<Patient>;
        auth: { user: { roles: string[] } };
        flash: { success?: string; error?: string };
        filters: { search?: string };
    }>().props;
    console.log(patients, 'patients');

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
        if (confirm('هل تريد حذف المريض؟')) {
            router.delete(route('patients.destroy', id));
        }
    };
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(route('patients.index'), { search }, { preserveState: true, replace: true });
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'patients',
            href: route('patients.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="patients" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">المرضى</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}
                    <InertiaLink
                        href={route('patients.create')}
                        className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        إضافة مريض
                    </InertiaLink>
                     <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="بحث عن مريض"
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">الاسم</th>
                                <th className="border px-2 py-1">الإيميل</th>
                                <th className="border px-2 py-1">الهاتف</th>
                                <th className="border px-2 py-1"> gender</th>
                                <th className="border px-2 py-1"> address</th>
                                <th className="border px-2 py-1"> date</th>

                                <th className="border px-2 py-1">nots</th>
                                <th className="border px-2 py-1">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients?.data?.map((p, i) => (
                                <tr key={p.id}>
                                    <td className="border px-2 py-1">
                                        {i + 1}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.name}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.email}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.phone}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.gender}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.address}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.birth_date}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.notes}
                                    </td>

                                    <td className="border px-2 py-1">
                                        <InertiaLink
                                            href={route('patients.edit', p.id)}
                                            className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                        >
                                            تعديل
                                        </InertiaLink>
                                        <InertiaLink
                                            href={route('patients.show', p.id)}
                                            className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                        >
                                            show
                                        </InertiaLink>
                                        {userHasDeletePermission && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(p.id)
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
                      <Pagination links={patients.links} />
                </div>
            </div>
        </AppLayout>
    );
}
