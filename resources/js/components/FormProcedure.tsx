import {  patientDetails, Procedure, ServiceCategory } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';
import { FormInput } from './FormInput';
import { Calendar, DollarSign, Layers, Stethoscope } from 'lucide-react';
import { FormSelect } from './FormSelect';
import { useAppToast } from '@/utils/toast';

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
const { success, error } = useAppToast();
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
            success('تم إضافة الإجراء بنجاح');
            onClose?.();

        },
        onError: () => {
            error('حدث خطأ أثناء إضافة الإجراء');
        },
    });
};


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded bg-white p-6 shadow"
        >
            <div className="grid grid-cols-1 gap-4 items-center md:grid-cols-2">
                {Array.isArray(services_category) &&
                    services_category.map((category) => (
                        <FormSelect
                            key={category.id}
                            label={`اختر خدمة من ${category.name}`}
                            name={`service_${category.id}`}
                            value={
                                category.services?.some(
                                    (s) =>
                                        s.id.toString() ===
                                        data.service_id?.toString(),
                                )
                                    ? data.service_id?.toString() || ''
                                    : ''
                            }
                            onChange={(val) => {
                                const serviceId = Number(val);
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
                            options={category.services.map((service) => ({
                                value: service.id.toString(),
                                label: service.name,
                            }))}
                            icon={Layers}
                        />
                    ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 items-center">
                <div>
                    <FormInput
                        label="اسم الإجراء"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e)}
                        icon={Stethoscope}
                    />
                </div>

                <div>
                     <FormInput
                        label="الكلفة"
                        type="number"
                        name="cost"
                        value={data.cost}
                        onChange={(e) => setData('cost', e)}
                        icon={DollarSign}
                    />
                </div>
                <div>
                    <FormSelect
                        label="حالة الإجراء"
                        name="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.toString())}
                        options={[
                            { value: 'planned', label: 'مخطط' },
                            { value: 'in_progress', label: 'قيد التنفيذ' },
                            { value: 'completed', label: 'مكتمل' },
                            { value: 'cancelled', label: 'ملغي' },
                        ]}
                        icon={Layers}
                    />
                </div>
                <div>
                     <FormInput
                        label="تاريخ الإجراء"
                        type="date"
                        name="processing_date"
                        value={data.processing_date}
                        onChange={(e) => setData('processing_date', e)}
                        icon={Calendar}
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
