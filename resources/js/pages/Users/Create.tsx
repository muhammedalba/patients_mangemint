"use client";

import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormRoles } from '@/components/FormRoles';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';
import { User, Mail, Lock, Phone } from 'lucide-react';

export default function CreateUser() {
  const { data, setData, post, processing, errors } = useForm<{
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
    roles: [],
  });

  const { success, error } = useAppToast();

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
    post(route('users.store'), {
      onSuccess: () => success('تم حفظ المستخدم بنجاح', 'تمت إضافة المستخدم إلى جدول المستخدمين'),
      onError: () => error('فشل حفظ المستخدم', 'يرجى التحقق من البيانات المدخلة'),
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المستخدمون', href: route('users.index') },
    { title: 'إضافة مستخدم', href: route('users.create') },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="إضافة مستخدم" />

      <div className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-green-700">
          إضافة مستخدم جديد
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="الاسم الكامل"
              name="name"
              value={data.name}
              onChange={(val) => setData('name', val)}
              placeholder="الاسم الكامل"
              error={errors.name}
              icon={User }
            />

            <FormInput
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={data.email}
              onChange={(val) => setData('email', val)}
              placeholder="البريد الإلكتروني"
              error={errors.email}
              icon={Mail }
            />

            <FormInput
              label="كلمة المرور"
              name="password"
              type="password"
              value={data.password}
              onChange={(val) => setData('password', val)}
              placeholder="كلمة المرور"
              error={errors.password}
              icon={Lock }
            />

            <FormInput
              label="رقم الهاتف"
              name="phone"
              type="text"
              value={data.phone}
              onChange={(val) => setData('phone', val)}
              placeholder="رقم الهاتف"
              error={errors.phone}
              icon={Phone }
            />

            <FormRoles
              label="الأدوار"
              availableRoles={availableRoles}
              selectedRoles={data.roles}
              toggleRole={toggleRole}
              error={errors.roles}
            />
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
              label="حفظ"
              loadingLabel="جارِ الحفظ ..."
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
