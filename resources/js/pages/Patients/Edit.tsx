"use client";

import { FormButton } from '@/components/FormButton';
import AppLayout from '@/layouts/app-layout';
import { Patient, type BreadcrumbItem } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';
import { User as UserIcon, Calendar, Phone, Mail } from 'lucide-react';
import LoadingPage from '@/components/LoadingPage';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';


export default function EditPatient({ patient }: { patient: Patient }) {
  const { data, setData, patch, processing, errors } = useForm({
    name: patient.name || '',
    email: patient.email || '',
    phone: patient.phone || '',
    birth_date: patient.birth_date || '',
    gender: patient.gender || '',
    marital_status: patient.marital_status || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useAppToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    patch(route('patients.update', patient.id), {
      onSuccess: () => success('تم تعديل بيانات المريض بنجاح'),
      onError: () => error('فشل تعديل بيانات المريض', 'يرجى التحقق من البيانات المدخلة'),
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المرضى', href: route('patients.index') },
    { title: `تعديل بيانات المريض: ${patient.name}`, href: route('patients.edit', patient.id) },
  ];

  if (isLoading) return <LoadingPage />;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`تعديل المريض: ${patient.name}`} />

      <div className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-700">
          تعديل بيانات المريض
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="اسم المريض"
              name="name"
              value={data.name}
              onChange={(val) => setData('name', val)}
              icon={UserIcon }
              error={errors.name}
            />

            <FormInput
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={data.email}
              onChange={(val) => setData('email', val)}
              icon={Mail }
              error={errors.email}
            />

            <FormInput
              label="رقم الهاتف"
              name="phone"
              type="tel"
              value={data.phone}
              onChange={(val) => setData('phone', val)}
              icon={Phone }
              error={errors.phone}
            />

            <FormInput
              label="تاريخ الميلاد"
              name="birth_date"
              type="date"
              value={data.birth_date}
              onChange={(val) => setData('birth_date', val)}
              icon={Calendar }
              error={errors.birth_date}
            />

            <FormSelect
              label="الجنس"
              name="gender"
              value={data.gender}
              onChange={(val) => setData('gender', val)}
              options={[
                { value: 'male', label: 'ذكر' },
                { value: 'female', label: 'أنثى' },

              ]}
              error={errors.gender}
                icon={UserIcon }
            />

            <FormSelect
              label="الحالة الاجتماعية"
              name="marital_status"
              value={data.marital_status}
              onChange={(val) => setData('marital_status', val)}
              options={[
                { value: 'single', label: 'عازب' },
                { value: 'married', label: 'متزوج' },
                { value: 'divorced', label: 'مطلق' },
                { value: 'widowed', label: 'أرمل' },
              ]}
                icon={UserIcon }
              error={errors.marital_status}
            />
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3">
            <Link
              href={route('patients.index')}
              className="w-full md:w-auto rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 text-center
                         transition-all duration-200 hover:bg-gray-300"
            >
              إنهاء
            </Link>

            <FormButton
              processing={processing}
              label="حفظ"
              loadingLabel="جارِ الحفظ ..."
              className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
