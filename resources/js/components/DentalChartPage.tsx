import { Patient, Service, ServiceCategory, Tooth } from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Odontogram } from 'react-odontogram';
import { route } from 'ziggy-js';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

type Chart = Tooth[];
interface Procedure {
    id: number;
    name: string;
    description?: string;
    cost?: number;
    tooth_id: number;
    patient_id: number;
    category?: string;
}
interface Tooth {
    id: number;
    tooth_number: number;
    status?: string;
    notes?: string;
    procedures?: Procedure[];
}
interface OdontoTooth {
    id: string;
    notations: {
        fdi: string;
        universal: string;
        palmer: string;
    };
    type: string;
}

type ProceduresByTooth = {
    [toothNumber: string]: Procedure[];
};

export default function DentalChartPage({
    patient,
    services_category = [],
}: {
    patient: Patient;
    services_category?: ServiceCategory[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        cost: string;
        tooth_id: string;
        patient_id: number;
        category: string;
    }>({
        name: '',
        description: '',
        cost: '',
        tooth_id: '',
        patient_id: patient.id,
        category: '',
    });

    const [chart, setChart] = useState<OdontoTooth[]>([]);
    const [selectedTooth, setSelectedTooth] = useState<OdontoTooth | null>(
        null,
    );
    const [selectedTeeth, setSelectedTeeth] = useState<OdontoTooth[]>([]);
    const [proceduresByTooth, setProceduresByTooth] =
        useState<ProceduresByTooth>({});
    const [showForm, setShowForm] = useState(false);

    const handleChange = (newChart: OdontoTooth[]) => {
        setChart(newChart);
        setSelectedTeeth(newChart);
    };

    const handleAddProcedureClick = (tooth: OdontoTooth) => {
        setSelectedTooth(tooth);
        setData('tooth_id', String(tooth.id));
        setShowForm(true);
    };

    const handleServiceSelect = (service: Service) => {
        setData('name', service.name);
        setData('cost', service.price.toString());
        setSelectedTreatment(service);
    };

    const [selectedTreatment, setSelectedTreatment] = useState<Service | null>(
        null,
    );

    const handleSaveProcedure = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedTooth) return;

        const newProcedure: Procedure = {
            id: Date.now(),
            name: data.name,
            description: data.description,
            cost: Number(data.cost),
            tooth_id: Number(selectedTooth.id),
            patient_id: patient.id,
            category: data.category,
        };

        post(
            route('procedures.store'),
            {
                name: newProcedure.name,
                description: newProcedure.description,
                cost: newProcedure.cost,
                tooth_id: newProcedure.tooth_id,
                patient_id: newProcedure.patient_id,
                category: newProcedure.category,
            },
            {
                onSuccess: () => {
                    router.post(route('teeth.store'), {
                        patient_id: patient.id,
                        tooth_number: selectedTooth.notations.fdi,
                        status: '',
                        notes: '',
                    });

                    setProceduresByTooth((prev) => ({
                        ...prev,
                        [selectedTooth.notations.fdi]: [
                            ...(prev[selectedTooth.notations.fdi] || []),
                            newProcedure,
                        ],
                    }));

                    reset();
                    setShowForm(false);
                },
                onError: (errors) => {
                    console.error('Backend validation errors:', errors);
                },
            },
        );
    };

    return (
        <div className="p-4" dir="rtl">
            <div className="odontogram-container">
                <h2 className="odontogram-title text-center text-xl font-bold">
                    المخطط السني🦷<span> | {patient.name}</span>
                </h2>

                <Odontogram
                    notation="FDI"
                    editable={true}
                    value={chart}
                    onChange={handleChange}
                    className="odontogram"
                />
            </div>

            {selectedTeeth.length > 0 && (
                <div className="mt-4 space-y-2">
                    {selectedTeeth.map((tooth) => (
                        <div
                            key={tooth.id}
                            className="flex items-center justify-between rounded border bg-gray-50 p-4"
                        >
                            <p className="font-semibold text-blue-600">
                                رقم السن المحدد: {tooth.notations.fdi}
                            </p>
                            <button
                                onClick={() => handleAddProcedureClick(tooth)}
                                className="mt-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                            >
                                إضافة إجراء
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSaveProcedure} className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {services_category.map((category) => (
                            <FormSelect
                                key={category.id}
                                label={`اختر خدمة من ${category.name}`}
                                name={`service_${category.id}`}
                                value={data.category}
                                onChange={(val) => {
                                    const selectedService =
                                        category.services.find(
                                            (service) =>
                                                service.id.toString() === val,
                                        );
                                    if (selectedService) {
                                        handleServiceSelect(selectedService);
                                    }
                                    setData('category', val);
                                }}
                                options={category.services.map((service) => ({
                                    value: service.id.toString(),
                                    label: service.name,
                                }))}
                                error={errors.category}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label=" اسم الإجراء"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="الاسم الإجراء"
                            error={errors.name}
                        />

                        {selectedTreatment && (
                            <FormInput
                                label=" المعالجة المختارة"
                                name="treatment_name"
                                value={selectedTreatment.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="المعالجة المختارة"
                            />
                        )}

                        <FormInput
                            label=" كلفة الإجراء"
                            name="cost"
                            value={data.cost}
                            onChange={(e) => setData('cost', e.target.value)}
                            placeholder="كلفة الإجراء"
                        />
                    </div>

                    <div>
                        <FormInput
                        label="وصف الإجراء"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="وصف الإجراء"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label="اسم المريض"
                            name="patient_name"
                            value={patient.name}
                            onChange={(val) => setData('patient_id', val)}
                        />

                        <FormSelect
                            label="اسم السن"
                            name="tooth_id"
                            value={data.tooth_id.toString()}
                            onChange={(val) => setData('tooth_id', val)}
                            error={errors.tooth_id}
                            options={(chart ?? []).map((tooth) => ({
                                value: tooth.id.toString(),
                                label: `رقم السن  ${tooth.notations.fdi}`,
                            }))}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('procedures.index')}
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
            )}

            {Object.keys(proceduresByTooth).length > 0 && (
                <div className="mt-6">
                    <h3 className="mb-2 text-lg font-bold">
                        الإجراءات حسب السن
                    </h3>
                    {Object.keys(proceduresByTooth).map((toothNumber) => (
                        <div key={toothNumber} className="mb-4">
                            <h4 className="font-bold">السن {toothNumber}</h4>
                            <table className="w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border px-4 py-2">
                                            اسم الإجراء
                                        </th>
                                        <th className="border px-4 py-2">
                                            الوصف
                                        </th>
                                        <th className="border px-4 py-2">
                                            الكلفة
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proceduresByTooth[toothNumber].map(
                                        (p, idx) => (
                                            <tr key={idx}>
                                                <td className="border px-4 py-2">
                                                    {p.name}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {p.description}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {p.cost}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
