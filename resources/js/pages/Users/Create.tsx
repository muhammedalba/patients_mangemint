import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormRoles } from '@/components/FormRoles';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

type UserFormData = {
    name: string;
    email: string;
    password: string;
    phone: string;
    roles: string[];
};

export default function CreateUser() {
    const { data, setData, post, processing, errors, reset } =
        useForm<UserFormData>({
            name: '',
            email: '',
            password: '',
            phone: '',
            roles: [],
        });

    const availableRoles = [
        { key: 'admin', label: 'مدير' },
        { key: 'doctor', label: 'طبيب' },
        { key: 'receptionist', label: 'استقبال' },
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
            onSuccess: () => reset('password'),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المستخدمون', href: route('users.index')},
        { title: 'إضافة مستخدم', href: route('users.create')},
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة مستخدم" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة مستخدم
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label="الاسم الكامل"
                            name="name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            placeholder="الاسم الكامل"
                            error={errors.name}
                        />

                        <FormInput
                            label="البريد الإلكتروني"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(val) => setData('email', val)}
                            placeholder="البريد الإلكتروني"
                            error={errors.email}
                        />

                        <FormInput
                            label="كلمة المرور"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(val) =>
                                setData('password', val)
                            }
                            placeholder="كلمة المرور"
                            error={errors.password}
                        />

                        <FormInput
                            label="رقم الهاتف"
                            name="phone"
                            type="text"
                            value={data.phone}
                            onChange={(val) => setData('phone', val)}
                            placeholder="رقم الهاتف"
                            error={errors.phone}
                        />

                        <FormRoles
                            label="الأدوار"
                            availableRoles={availableRoles}
                            selectedRoles={data.roles}
                            toggleRole={toggleRole}
                            error={errors.roles}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('users.index')}
                            className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                        >
                            إنهاء
                        </Link>
                        <FormButton
                            processing={processing}
                            label="حفظ"
                            loadingLabel="جارِ الحفظ ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
