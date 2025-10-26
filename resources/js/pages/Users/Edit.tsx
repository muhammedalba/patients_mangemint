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
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        roles: user.roles || [],
    });

    const [submitted, setSubmitted] = useState(false);

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
        post(route('users.update', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 2500);
            },
        });
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create User',
            href: '/CreateUser',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="uesrs" />
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
                    تعديل المستخدم
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* الاسم */}
                    <div>
                        <label className="mb-1 block text-gray-700">
                            الاسم
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="الاسم الكامل"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* البريد */}
                    <div>
                        <label className="mb-1 block text-gray-700">
                            البريد الإلكتروني
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
                            كلمة المرور (اختياري)
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder="كلمة المرور الجديدة"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* الأدوار */}
                    <div>
                        <label className="mb-2 block text-gray-700">
                            الأدوار
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

                    {/* الهاتف */}
                    <div>
                        <label className="mb-1 block text-gray-700">
                            رقم الهاتف
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="رقم الهاتف"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* زر التحديث */}
                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded-lg px-8 py-2.5 font-semibold text-white transition-all duration-200 ${
                                processing
                                    ? 'cursor-not-allowed bg-green-400'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {processing ? 'جارٍ التحديث...' : 'تحديث المستخدم'}
                        </button>

                        {submitted && (
                            <p className="mt-3 text-sm text-green-600">
                                ✅ تم التحديث بنجاح!
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
