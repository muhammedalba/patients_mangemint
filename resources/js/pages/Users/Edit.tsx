
import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';
import { User as UserIcon, Mail, Lock, Phone } from 'lucide-react';

export default function EditUser({ user }: { user: User }) {
  const { data, setData, put, processing, errors } = useForm<{
    name: string;
    email: string;
    password: string;
    phone: string;
    roles: string[];
  }>({
    name: user.name ?? '',
    email: user.email ?? '',
    password: '',
    phone: user.phone ?? '',
    roles: (user.roles ?? []) as unknown as string[],
  });


  const { success, error, warning } = useAppToast();

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
        : [...data.roles, role]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
//  validate data 
    if (!data.name || !data.email  ) {
      warning('فشل تعديل المستخدم', 'يرجى التحقق من البيانات المدخلة');
      return;
    }
    put(route('users.update', user.id), {
      onSuccess: () => {
        success('تم تعديل  بنجاح', 'تم تعديل المستخدم بنجاح');
      },
      onError: () => {
        error('فشل تعديل المستخدم', 'يرجى التحقق من البيانات المدخلة');
      },
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المستخدمون', href: route('users.index') },
    {
      title:  ` تعديل بيانات المستخدم :  ${user.name}`,
      href: route('users.edit', user.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`تعديل المستخدم: ${user.name}`} />

      <div className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-700">
          تعديل بيانات المستخدم
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              type="text"
              label="الاسم الكامل"
              name="name"
              value={data.name}
              onChange={(val) => setData('name', val)}
              placeholder="Full Name"
              error={errors.name}
              icon={UserIcon }
            />

            <FormInput
              type="email"
              label="البريد الإلكتروني"
              name="email"
              value={data.email}
              onChange={(val) => setData('email', val)}
              placeholder="example@email.com"
              error={errors.email}
              icon={Mail }
            />

            <FormInput
              type="password"
              label="كلمة المرور (اختياري)"
              name="password"
              value={data.password}
              onChange={(val) => setData('password', val)}
              placeholder="New Password"
              error={errors.password}
              icon={Lock }
            />

            <FormInput
              type="text"
              label="رقم الهاتف"
              name="phone"
              value={data.phone}
              onChange={(val) => setData('phone', val)}
              placeholder="Phone"
              error={errors.phone}
              icon={Phone }
            />

            {/* Roles */}
            <div>
              <label className="mb-2 block text-gray-700 font-medium">
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
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                        selected
                          ? 'bg-blue-600 text-white shadow-sm border border-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
              {errors.roles && (
                <p className="mt-1 text-sm text-red-500">{errors.roles}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3">
            <Link
              href={route('users.index')}
              className="w-full md:w-auto rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 text-center
                         transition-all duration-200 hover:bg-gray-300"
            >
              إنهاء
            </Link>

            <FormButton
              processing={processing}
              label="تعديل"
              loadingLabel="جارِ التعديل ..."
              className="w-full md:w-auto "
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
