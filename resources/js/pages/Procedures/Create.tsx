import LoadingPage from '@/components/LoadingPage';
import TreatmentsForm from '@/components/ui/TreatmentsForm';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

export default function CreateProcedure({
    teeth,
    patient_id,
    patients,
    services,
}: {
    teeth: any[];
    patient_id?: number;
    patients: any[];
    services: any[];
}) {
    const handleToothClick = (patient: any) => {
        console.log(patient);
        setData('patient_id', patient);
    };
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        cost: string;
        tooth_id: string;
        patient_id: string;
    }>({
        name: '',
        description: '',
        cost: '',
        tooth_id: teeth[0]?.id || '',
        patient_id: patient_id || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleTreatmentSelect = (treatment: {
        name: string;
        cost: number;
    }) => {
        setData('name', treatment.name);
        setData('cost', treatment.cost.toString());
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            router.post(route('procedures.store', { patient_id }), data, {
                onSuccess: () => reset(),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Procedures',
            href: route('procedures.index'),
        },
        {
            title: 'Create Procedure',
            href: route('procedures.create'),
        },
    ];
    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Procedure" />
            <div className="mx-auto mt-4 w-3xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة إجراء جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TreatmentsForm onSelect={handleTreatmentSelect} />
                    <div>
                        <label className="mt-4 block text-right text-gray-700">
                            المعالجة المختارة
                        </label>
                        <input
                            type="text"
                            name="treatment_name"
                            value={data.name}
                            readOnly
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="mt-4 block text-right text-gray-700">
                            كلفة الإجراء
                        </label>
                        <input
                            type="number"
                            name="cost"
                            value={data.cost}
                            readOnly
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="name"
                            className="mt-4 block text-right text-gray-700"
                        >
                            الوصف
                        </label>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="وصف الإجراء"
                            className="w-full rounded-lg border px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <select
                            name="patient_id"
                            value={data.patient_id}
                            onChange={(e) => handleToothClick(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">select patient </option>
                            {patients?.map((patient) => (
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
                        <select
                            name="tooth_id"
                            value={data.tooth_id}
                            onChange={(e) =>
                                setData('tooth_id', e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="" disabled>
                                اختر السن
                            </option>
                            {teeth?.length > 0 ? (
                                teeth.map((tooth) => (
                                    <option key={tooth.id} value={tooth.id}>
                                        {tooth.tooth_number}
                                    </option>
                                ))
                            ) : (
                                <option disabled>لا توجد أسنان متاحة</option>
                            )}
                        </select>
                        {errors.tooth_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.tooth_id}
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
                            {processing ? 'جارٍ الحفظ...' : 'حفظ الإجراء'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
