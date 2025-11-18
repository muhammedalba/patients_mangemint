import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function CreateTeeth({
    patients,
    patient_id,
}: {
    patients: any[];
    patient_id?: number;
}) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        patient_id: string;
        tooth_number: string;
        status: string;
        notes: string;
    }>({
        patient_id: patient_id?.toString() || '',
        tooth_number: '',
        status: '',
        notes: '',
    });
    console.log(patients);
    console.log(patient_id, 'patient_id');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('teeth.store'), {
            onSuccess: () => reset(),
        });
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create Teeth',
            href: '/CreateTeeth',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teeth" />
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    إضافة سن جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <select
                            name="patient_id"
                            value={data.patient_id}
                            onChange={(e) =>
                                setData('patient_id', e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            disabled={!!patient_id}
                        >
                            <option value="">اختر المريض</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                        {errors.patient_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.patient_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="tooth_number"
                            value={data.tooth_number}
                            onChange={(e) =>
                                setData('tooth_number', e.target.value)
                            }
                            placeholder="رقم السن"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.tooth_number && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.tooth_number}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            placeholder="الحالة"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div>
                        <textarea
                            name="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="ملاحظات"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.notes}
                            </p>
                        )}
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
                            {processing ? 'جارٍ الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
