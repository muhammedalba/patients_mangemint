import { Patient, Service, ServiceCategory, Tooth } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { FormEvent, useRef, useState } from 'react';
import { Odontogram } from 'react-odontogram';
import { route } from 'ziggy-js';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

type Chart = Record<string, any>;

interface Procedure {
    name: string;
    description: string;
    cost: string;
    tooth_id: string | null;
    tooth_number: string;
    patient_id:number;
    patient_name: string;
    category: string;
}

type ProceduresByTooth = {
    [toothNumber: string]: Procedure[];
};

export default function DentalChartPage({
    teeth,
    patient,
    services_category = [],
}: {
    teeth: Tooth[];
    patient: Patient;
    services_category?: ServiceCategory[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        cost: string;
        tooth_id: string | null;
        tooth_number: string;
        patient_id: number;
        patient_name: string;
        category: string;
    }>({
        name: '',
        description: '',
        cost: '',
        tooth_id: '',
        tooth_number: '',
        patient_id: patient.id,
        patient_name: patient.name,
        category: '',
    });

    const [chart, setChart] = useState<Chart>({});
    const [selectedTeeth, setSelectedTeeth] = useState<Tooth[]>([]);
    const [proceduresByTooth, setProceduresByTooth] =
        useState<ProceduresByTooth>({});
    const [showForm, setShowForm] = useState(false);
    const prev = useRef<Chart>({});

    const handleChange = (next: Chart) => {
        let changedKey: string | null = null;

        for (const k of Object.keys(next)) {
            if (JSON.stringify(prev.current[k]) !== JSON.stringify(next[k])) {
                changedKey = k;
                break;
            }
        }

        prev.current = next;
        setChart(next);

        if (!changedKey) return;

        const toothObj = next[changedKey];
        const fdi = toothObj?.notations?.fdi ?? toothObj?.fdi ?? changedKey;
        const id = toothObj?.id ?? changedKey;

        const newTooth: Tooth = {
            id: String(id),
            tooth_number: String(fdi),
        };

        setSelectedTeeth((prev) => {
            const exists = prev.some((t) => t.id === newTooth.id);
            return exists ? prev : [...prev, newTooth];
        });
    };

    const handleAddProcedureClick = (selectedTeeth: Tooth) => {
        setShowForm(true);
        setData({
            name: '',
            description: '',
            cost: '',
            tooth_id: selectedTeeth.id,
            tooth_number: selectedTeeth.tooth_number,
            patient_id: patient.id,
            patient_name: patient.name,
            category: '',
        });
        console.log('Matched tooth:', selectedTeeth);
        console.log('services_category', services_category);
    };

    const handleServiceSelect = (service: Service) => {
        setData('name', service.name);
        setData('cost', service.price.toString());
    };
    const [selectedTreatment, setSelectedTreatment] = useState<Service | null>(
        null,
    );

    const handleSaveProcedure = (e: FormEvent) => {
        e.preventDefault();

        const newProcedure: Procedure = {
            name: data.name,
            description: data.description,
            cost: data.cost,
            tooth_number: data.tooth_number,
            tooth_id: data.tooth_id,
            patient_id: data.patient_id,
            patient_name: data.patient_name,
            category: data.category,
        };

        console.log('New procedure', newProcedure);

        setProceduresByTooth((prev) => {
            const updated = {
                ...prev,
                [data.tooth_number]: [
                    ...(prev[data.tooth_number] || []),
                    newProcedure,
                ],
            };
            return updated;
        });

        post(route('procedures.store'), {
            onSuccess: () => {
                console.log('Procedure saved');
                reset();
                setShowForm(false);
                setChart((prevChart) => {
                    const updatedChart = {
                        ...prevChart,
                        [data.tooth_number]: {
                            ...prevChart[data.tooth_number],
                            style: {
                                fill: 'red',
                                stroke: 'darkred',
                                strokeWidth: 2,
                            },
                        },
                    };
                    return updatedChart;
                });
            },
            onError: (errors) => {
                console.error('Backend validation errors:', errors);
            },
        });
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
                                رقم السن المحدد: {tooth.tooth_number}
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
                        {(services_category ?? []).map((category) => (
                            <FormSelect
                                key={category.id}
                                label={`اختر خدمة من ${category.name}`}
                                name={`service_${category.id}`}
                                value={data.category}
                                onChange={(val) => {
                                    const selectedService = (
                                        category.services ?? []
                                    ).find(
                                        (service) =>
                                            service.id.toString() === val,
                                    );
                                    if (selectedService) {
                                        handleServiceSelect(selectedService);
                                    }
                                    setData('category', val);
                                }}
                                options={(category.services ?? []).map(
                                    (service) => ({
                                        value: service.id.toString(),
                                        label: service.name,
                                    }),
                                )}
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

                    <FormInput
                        label=" وصف الإجراء"
                        name="description"
                        type="textarea"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="وصف الإجراء"
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                            label=" اسم المريض "
                            name="patient_name"
                            value={data.patient_name}
                            onChange={(e) =>
                                setData('patient_name', e.target.value)
                            }
                            placeholder="اسم المريض"
                        />
                    </div>

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
                // <form
                //     onSubmit={handleSaveProcedure}
                //     className="mt-4 rounded border bg-white p-4 shadow"
                // >
                //     <h3 className="mb-2 font-bold">
                //         إضافة إجراء للسن {data.tooth_number}
                //     </h3>

                //     <label className="mb-2 block">
                //         اسم الإجراء:
                //         <input
                //             type="text"
                //             value={data.name}
                //             onChange={(e) => setData('name', e.target.value)}
                //             className="w-full rounded border px-2 py-1"
                //             required
                //         />
                //     </label>

                //     <label className="mb-2 block">
                //         الوصف:
                //         <textarea
                //             value={data.description}
                //             onChange={(e) =>
                //                 setData('description', e.target.value)
                //             }
                //             className="w-full rounded border px-2 py-1"
                //         />
                //     </label>

                //     <label className="mb-2 block">
                //         الكلفة:
                //         <input
                //             type="text"
                //             value={data.cost}
                //             onChange={(e) => setData('cost', e.target.value)}
                //             className="w-full rounded border px-2 py-1"
                //             required
                //         />
                //     </label>

                //     <div className="flex gap-2">
                //         <button
                //             type="submit"
                //             className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                //             disabled={processing}
                //         >
                //             {processing ? 'جارِ الحفظ...' : 'حفظ'}
                //         </button>
                //         <button
                //             type="button"
                //             onClick={() => setShowForm(false)}
                //             className="rounded bg-gray-400 px-3 py-1 text-white hover:bg-gray-500"
                //         >
                //             إلغاء
                //         </button>
                //     </div>
                // </form>
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
