import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Patient } from '@/types';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Index() {
    const { patients, auth, flash, filters } = usePage<{
        patients: PaginatedData<Patient>;
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
        if (confirm('Are you sure you want to delete this patient?   ')) {
            router.delete(route('patients.destroy', id));
        }
    };
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(
                route('patients.index'),
                { search },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'patients',
            href: route('patients.index'),
        },
    ];
    const getAgeFromBirthDate = (birthDate: string): number =>
        new Date().getFullYear() - new Date(birthDate).getFullYear();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="patients" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-bold">Patients</h1>
                    {showToast && (
                        <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                            {flash?.success || flash?.error}
                        </div>
                    )}
                    <div className="mb-4 flex items-center justify-between">
                        <InertiaLink
                            href={route('patients.create')}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            <span className="flex items-center gap-1">
                                Add Patient
                                <i className="material-icons text-lg">add</i>
                            </span>
                        </InertiaLink>
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 shadow-sm transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <span className="absolute top-2.5 left-3 text-gray-400">
                                <i className="material-icons text-lg">search</i>
                            </span>
                        </div>
                    </div>

                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">Full Name</th>
                                <th className="border px-2 py-1">Age</th>
                                <th className="border px-2 py-1">Contact</th>
                                <th className="border px-2 py-1">Gender</th>
                                <th className="border px-2 py-1">
                                    Marital status
                                </th>
                                <th className="border px-2 py-1">
                                    Chronic Diseases
                                </th>
                                <th className="border px-2 py-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients?.data?.map((p, i) => (
                                <tr key={p.id}>
                                    <td className="border px-2 py-1 text-center">
                                        {i + 1}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {p.name}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {getAgeFromBirthDate(p.birth_date)}{' '}
                                        years
                                    </td>
                                    <td className="border px-1 py-1 text-center">
                                        <i className="material-icons text-xs font-bold text-gray-700">
                                            phone enabled
                                        </i>
                                        <i className="fab fa-whatsapp text-xl text-green-500"></i>
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {p.gender}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {p.marital_status}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {p.diseases}
                                    </td>

                                    <td className="border px-2 py-1 text-center">
                                        <InertiaLink
                                            href={route('patients.edit', p.id)}
                                            className="mr-2 text-xs font-bold text-gray-700"
                                        >
                                            <i className="material-icons">
                                                edit
                                            </i>
                                        </InertiaLink>
                                        <InertiaLink
                                            href={route('patients.show', p.id)}
                                            className="mr-2 text-xs font-bold text-blue-500"
                                        >
                                            <i className="material-icons">
                                                visibility
                                            </i>
                                        </InertiaLink>
                                        {userHasDeletePermission && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(p.id)
                                                }
                                                className="mr-2 text-xs font-bold text-red-500"
                                            >
                                                <i className="material-icons">
                                                    delete
                                                </i>
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
