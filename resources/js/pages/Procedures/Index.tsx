import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface Procedures {
    data: [];
    tooth: {
        tooth_number: string;
    };

}

export default function Index() {
    const { procedures, auth } = usePage<{
        procedures: Procedures[];
        auth: { user: { roles: string[] } };
    }>().props;
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
console.log(procedures,'procedures');

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
        if (confirm('هل تريد حذف الإجراء؟')) {
            router.delete(route('procedures.destroy', id));
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Procedures',
            href: route('procedures.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Procedures" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">الإجراءات</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {props.flash?.success || props.flash?.error}
                        </div>
                    )}
                    <InertiaLink
                        href={route('procedures.create')}
                        className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        إضافة إجراء
                    </InertiaLink>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">الاسم</th>
                                <th className="border px-2 py-1">patient</th>
                                <th className="border px-2 py-1">الوصف</th>
                                <th className="border px-2 py-1">التكلفة</th>
                                <th className="border px-2 py-1">المدة (بالدقائق)</th>
                                <th className="border px-2 py-1">رقم السن</th>
                                <th className="border px-2 py-1">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procedures?.data?.map((p, i) => (
                                <tr key={p.id}>
                                    <td className="border px-2 py-1">
                                        {i + 1}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.name}
                                    </td>
                                     <td className="border px-2 py-1">
                                        {p.patient}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.description}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.cost}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.duration_minutes}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.tooth_number}
                                    </td>
                                    <td className="border px-2 py-1">
                                        <InertiaLink
                                            href={route('procedures.edit', p.id)}
                                            className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                        >
                                            تعديل
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
                       <Pagination links={procedures.links} />
                </div>
            </div>
        </AppLayout>
    );
}
