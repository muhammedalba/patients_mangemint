import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

interface PatientFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  birth_date: string;
  gender: 'male' | 'female' | '';
  marital_status: 'single' | 'married' | 'divorced' | 'widow' | '';
}

export default function CreatePatient() {
  const { data, setData, post, processing, errors, reset } =
    useForm<PatientFormData>({
      name: '',
      email: '',
      phone: '',
      notes: '',
      birth_date: '',
      gender: '',
      marital_status: '',
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('patients.store'), {
      onSuccess: () => reset(),
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المرضى', href: route('patients.index') },
    { title: 'إضافة مريض', href: route('patients.create') },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="إضافة مريض" />
      <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-xl font-bold text-gray-700">
          إضافة مريض
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="الاسم الكامل"
              name="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="الاسم الكامل"
              error={errors.name}
            />

            <FormInput
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="البريد الإلكتروني"
              error={errors.email}
            />

            <FormInput
              label="رقم الهاتف"
              name="phone"
              type="text"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              placeholder="رقم الهاتف"
              error={errors.phone}
            />

            <FormInput
              label="تاريخ الميلاد"
              name="birth_date"
              type="date"
              value={data.birth_date}
              onChange={(e) => setData('birth_date', e.target.value)}
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
            />

            <FormSelect
              label="الحالة الاجتماعية"
              name="marital_status"
              value={data.marital_status}
              onChange={(val) => setData('marital_status', val)}
              options={[
                { value: 'singlw', label: 'عازب' },
                { value: 'married', label: 'متزوج' },
                { value: 'divorced', label: 'مطلق' },
                { value: 'widow', label: 'أرمل' },
              ]}
              error={errors.marital_status}
            />

            <div>
              <label htmlFor="notes" className="mb-2 block text-gray-700">
                الملاحظات
              </label>
              <textarea
                id="notes"
                name="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                placeholder="Notes"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={3}
              ></textarea>
              {errors.notes && (
                <p className="mt-1 text-sm text-red-500">{errors.notes}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Link
              href={route('patients.index')}
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
