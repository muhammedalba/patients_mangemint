import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function CreateUser() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        email: string;
        password: string;
        phone: string;
        roles: string[];
    }>({
        name: '',
        email: '',
        password: '',
        phone: '',
        roles: [], // يمكن اختيار أكثر من دور
    });

    const availableRoles = [
        { key: 'admin', label: 'مدير' },
        { key: 'doctor', label: 'طبيب' },
        { key: 'receptionist', label: 'استقبال' },
        { key: 'patient', label: 'مريض' },
    ];

    const toggleRole = (role: string) => {
        setData(
            'roles',
            data.roles.includes(role)
                ? data.roles.filter((r) => r !== role)
                : [...data.roles, role],
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => reset('password'), // إعادة تعيين كلمة المرور بعد الحفظ
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
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    إضافة مستخدم جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* الاسم */}
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="الاسم الكامل"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="البريد الإلكتروني"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* كلمة المرور */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder="كلمة المرور"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* الهاتف */}
                    <div>
                        <input
                            type="text"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="رقم الهاتف"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.phone}
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

                    {/* زر الإرسال */}
                    <div className="mt-4 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-200 ${
                                processing
                                    ? 'cursor-not-allowed bg-blue-400'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {processing ? 'جارٍ الحفظ...' : 'حفظ المستخدم'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
