import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Patient } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function EditPatient({ patient }: { patient: Patient }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        address: patient.address || '',
        notes: patient.notes || '',
        birth_date: patient.birth_date || '',
        gender: patient.gender || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('patients.update', patient.id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        { title: `تعديل: ${patient.name}`, href: route('patients.edit', patient.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل المريض: ${patient.name}`} />
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    تعديل بيانات المريض
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-2 block text-gray-700">الاسم الكامل</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="الاسم الكامل"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-2 block text-gray-700">البريد الإلكتروني</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="البريد الإلكتروني"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="mb-2 block text-gray-700">رقم الهاتف</label>
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="رقم الهاتف"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div>
                        <label htmlFor="birth_date" className="mb-2 block text-gray-700">تاريخ الميلاد</label>
                        <input
                            id="birth_date"
                            type="date"
                            name="birth_date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.birth_date && <p className="mt-1 text-sm text-red-500">{errors.birth_date}</p>}
                    </div>

                    <div>
                        <label htmlFor="gender" className="mb-2 block text-gray-700">الجنس</label>
                        <select
                            id="gender"
                            name="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value as 'male' | 'female')}
                            className="w-full rounded-lg border bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">اختر الجنس</option>
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="mb-2 block text-gray-700">العنوان</label>
                        <textarea
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="العنوان"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={3}
                        ></textarea>
                        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div>
                        <label htmlFor="notes" className="mb-2 block text-gray-700">ملاحظات</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="ملاحظات"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={3}
                        ></textarea>
                        {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes}</p>}
                    </div>

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
                            {processing ? 'جارٍ التحديث...' : 'تحديث بيانات المريض'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
