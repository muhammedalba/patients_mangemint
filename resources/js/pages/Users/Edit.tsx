import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

interface User {
    id?: number | string;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    roles?: string[];
}
// interface Errors {
//     [key: string]: string;
// }

export default function EditUser({ user }: { user: User }) {
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
    console.log(props, 'user-edit');
    console.log(user, 'user-user');
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        roles: user.roles || [],
    });

    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // جميع الأدوار الممكنة في النظام
    const availableRoles = [
        { key: 'admin', label: 'مدير' },
        { key: 'doctor', label: 'طبيب' },
        { key: 'receptionist', label: 'استقبال' },
        { key: 'patient', label: 'مريض' },
    ];

    // التبديل بين إضافة/إزالة الدور
    const toggleRole = (role: string) => {
        setData(
            'roles',
            data.roles.includes(role)
                ? data.roles.filter((r) => r !== role) // إزالة
                : [...data.roles, role], // إضافة
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            post(route('users.update', user.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setSubmitted(true);
                    setTimeout(() => setSubmitted(false), 2500);
                },
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `Update: ${user.name}`,
            href: route('patients.edit', user.id),
        },
    ];
    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="uesrs" />
            <div className="mx-auto mt-4 w-xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    Update User
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Full Name"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            Email{' '}
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="example@email.com"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* كلمة المرور */}
                    <div>
                        <label className="mb-1 block text-gray-700">
                            Password (Optional){' '}
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder="New Password"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700">
                            Phone
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Phone "
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-gray-700">
                            Roles{' '}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableRoles.map((role) => {
                                const selected = data.roles.includes(role.key);
                                return (
                                    <button
                                        key={role.key}
                                        type="button"
                                        onClick={() => toggleRole(role.key)}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                                            selected
                                                ? 'border-green-600 bg-green-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {role.label}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.roles && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.roles}
                            </p>
                        )}
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-200 ${
                                processing
                                    ? 'cursor-not-allowed bg-green-400'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {processing ? 'Updating...' : 'Update User'}
                        </button>

                        {submitted && (
                            <p className="mt-3 text-sm text-green-600">
                                ✅ Update Successfully
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
