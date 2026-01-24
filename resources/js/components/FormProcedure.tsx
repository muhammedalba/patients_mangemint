import {  patientDetails, Procedure, ServiceCategory } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

interface ProcedureFormData {
    name: string;
    description: string;
    processing_date: string;
    status: string;
    cost: string;
    duration_minutes: number;
    follow_up_days: number;
    patient_id: number;
    tooth_id: number;
    service_id?: number;
}

type FormProcedureProps = Readonly <
{
    patient: patientDetails;
    services_category: ServiceCategory[];
    toothId: number;
    onClose?: () => void;
    onCreated: (procedure:Procedure) => void;
}>;


export default function FormProcedure({
    patient,
    services_category,
    toothId,
    onClose,
    onCreated,
}: FormProcedureProps) {
   const { data, setData, post, processing } = useForm<ProcedureFormData>({
    name: '',
    description: '',
    processing_date: new Date().toISOString().slice(0, 10),
    status: 'planned',
    cost: '',
    duration_minutes: 1,
    follow_up_days: 0,
    patient_id: patient.id,
    tooth_id: toothId,
});

    const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const optimisticProcedure : Procedure = {
        id: Date.now(),
        name: data.name,
        cost: Number(data.cost),
        duration_minutes: data.duration_minutes,
        tooth: patient.teeth.find(t => t.id.toString() === toothId.toString())!,
        patient: patient,
        patient_id: patient.id,
        status: data.status,
        tooth_id: data.tooth_id ?? undefined,
       processing_date: new Date(data.processing_date).toISOString(),
       follow_up_days: data.follow_up_days,
    };

    onCreated(optimisticProcedure);

    post(route('procedures.store'), {
        preserveScroll: true,
        onSuccess: () => {
            onClose?.();
        },
        onError: () => {
        },
    });
};


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded bg-white p-6 shadow"
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                {services_category.map((category) => (
                    <div key={category.id}>
                        <label className="mb-1 block font-semibold">
                            {category.name}
                        </label>
                        <select
                            className="w-full rounded border p-2"
                            onChange={(e) => {
                                const serviceId = Number(e.target.value);

                                const selectedService = category.services?.find(
                                    (s) => s.id === serviceId,
                                );

                                if (selectedService) {
                                    setData('service_id', selectedService.id);
                                    setData('name', selectedService.name);
                                    setData(
                                        'cost',
                                        String(selectedService.price),
                                    );
                                }
                            }}
                        >
                            <option value="">اختر {category.name}</option>

                            {(category.services ?? []).map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                    <label className="mb-1 block text-sm text-gray-600">
                        اسم الإجراء
                    </label>
                    <input
                        type="text"
                        className="w-full rounded border p-2"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-600">
                        الكلفة
                    </label>
                    <input
                        type="number"
                        className="w-full rounded border p-2"
                        value={data.cost}
                        onChange={(e) => setData('cost', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">
                        حالة الإجراء
                    </label>
                    <select
                        className="w-full rounded border p-2"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                    >
                        <option value="planned">مخطط</option>
                        <option value="in_progress">قيد التنفيذ</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">
                        تاريخ الإجراء
                    </label>
                    <input
                        type="date"
                        className="w-full rounded border p-2"
                        value={data.processing_date}
                        onChange={(e) =>
                            setData('processing_date', e.target.value)
                        }
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Link
                    onClick={onClose}
                    className="rounded bg-gray-200 px-4 py-2 text-gray-700"
                >
                    إلغاء
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                    حفظ
                </button>
            </div>
        </form>
    );
}
