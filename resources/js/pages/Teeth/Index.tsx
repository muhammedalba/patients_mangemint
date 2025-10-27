
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps, PaginatedData } from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export interface Teeth {
    id: number;
    patient: { id: number; name: string };
    patient_id: number;
    tooth_number: string;
    status: string;
    notes: string;
}

export default function Index({
    teeth,
    auth,
    filters,
}: PageProps<{
    teeth: PaginatedData<Teeth>;
    auth: { user: { roles: string[] } };
    filters: { search?: string };
}>) {
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
    const [search, setSearch] = useState(filters.search || '');
console.log(teeth,'teethData');
console.log(auth,'auth');


    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(route('tooth.index'), { search }, { preserveState: true, replace: true });
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    const canDeleteRoles = ['doctor', 'admin'];
    const userHasDeletePermission = canDeleteRoles.some((role) =>
        auth.user.roles.includes(role),
    );
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (props.flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [props.flash]);

    const handleDelete = (id: number): void => {
        if (confirm('هل تريد حذف السن؟')) {
            router.delete(route('tooth.destroy', id));
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teeth',
            href: route('tooth.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teeth" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الأسنان</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {props.flash?.success || props.flash?.error}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                        <InertiaLink
                            href={route('tooth.create')}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            إضافة سن
                        </InertiaLink>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="بحث..."
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">اسم المريض</th>
                                <th className="border px-2 py-1">رقم السن</th>
                                <th className="border px-2 py-1">الحالة</th>
                                <th className="border px-2 py-1">ملاحظات</th>
                                <th className="border px-2 py-1">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teeth?.data?.map((t, i) => (
                                <tr key={t.id}>
                                    <td className="border px-2 py-1">{i + 1}</td>
                                    <td className="border px-2 py-1">{t.patient?.name}</td>
                                    <td className="border px-2 py-1">{t.tooth_number}</td>
                                    <td className="border px-2 py-1">{t.status}</td>
                                    <td className="border px-2 py-1">{t.notes}</td>
                                    <td className="border px-2 py-1">
                                        <InertiaLink
                                            href={route('tooth.edit', t.id)}
                                            className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                        >
                                            تعديل
                                        </InertiaLink>
                                        {userHasDeletePermission && (
                                            <button
                                                onClick={() => handleDelete(t.id)}
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
                    <Pagination links={teeth.links} />
                </div>
            </div>
        </AppLayout>
    );
}
