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
    category: string;
    processing_date: string;
    cost: number;
    patient_id: number;
    tooth_id: number;
    status: string;
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
    status?: 'healthy' | 'filled' | 'treated' | 'extracted';
    procedures?: Procedure[];
}

type ProceduresByTooth = {
    [toothNumber: string]: Procedure[];
};

export default function DentalChartPage({
    patient_id,
    patient,
    services_category,
}: {
    patient_id?: number;
    patient: Patient;
    services_category: ServiceCategory[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        status: string;
        cost: string;
        tooth_id: string;
        patient_id: string;
        category: string;
        processing_date: string;
    }>({
        name: '',
        status: 'planned',
        description: '',
        cost: '',
        tooth_id: '',
        patient_id: patient_id?.toString() || '',
        category: '',
        processing_date: new Date().toISOString().split('T')[0], // تاريخ اليوم افتراضيًا
    });
    console.log('errors', errors);
    console.log('data', data);

    const [chart, setChart] = useState<OdontoTooth[]>([]);
    const [selectedTooth, setSelectedTooth] = useState<OdontoTooth>(null);
    const [selectedTeeth, setSelectedTeeth] = useState<OdontoTooth[]>([]);
    const [proceduresByTooth, setProceduresByTooth] =
        useState<ProceduresByTooth>({});
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (newChart: OdontoTooth[]) => {
        setChart(newChart);
        setSelectedTeeth(newChart);
    };

    const handleAddProcedureClick = (tooth: OdontoTooth) => {
        setSelectedTooth(tooth);
        setData('tooth_id', selectedTooth ? selectedTooth.id.toString() : '');
        setData('patient_id', patient.id.toString());

        setShowForm(true);
    };

    const handleServiceSelect = (service: Service) => {
        setData('name', service.name);
        setData('cost', service.price.toString());
    };

    const handleSaveProcedure = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedTooth) return;

        setData('tooth_id', selectedTooth.id.toString());
        setData('patient_id', patient.id.toString());

        post(route('procedures.store'), {
            onSuccess: () => {
                router.post(route('teeth.store'), {
                    patient_id: patient.id,
                    tooth_number: selectedTooth.notations.fdi,
                    status: '',
                    notes: '',
                });

                // حدّث الإجراءات في الواجهة
                setProceduresByTooth((prev) => ({
                    ...prev,
                    [selectedTooth.notations.fdi]: [
                        ...(prev[selectedTooth.notations.fdi] || []),
                        {
                            id: Date.now(),
                            name: data.name,
                            description: data.description,
                            cost: Number(data.cost),
                            tooth_id: Number(selectedTooth.id),
                            patient_id: patient.id,
                            category: data.category,
                            status: data.status,
                            processing_date: data.processing_date,
                        },
                    ],
                }));
                // 👇 حدّث حالة السن في الـ chart

                setChart((prevChart) =>
                    prevChart.map((tooth) =>
                        tooth.id === selectedTooth.id
                            ? {
                                  ...tooth,
                                //   status:
                                //       nameToStatus[data.name] || 'treated',
                                  procedures: [
                                      ...(tooth.procedures || []),
                                      {
                                          id: Date.now(),
                                          name: data.name,
                                          description: data.description,
                                          category: data.category,
                                          processing_date: data.processing_date,
                                          cost: Number(data.cost),
                                          patient_id: patient.id,
                                          tooth_id: Number(selectedTooth.id),
                                          status: data.status,
                                      },
                                  ],
                              }
                            : tooth,
                    ),
                );

                reset();
                setShowForm(false);
            },
            onError: (errors) => {
                console.error('Backend validation errors:', errors);
            },
        });
    };


    console.log(chart);

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
                            className="flex items-center justify-between rounded border bg-gray-50 p-1"
                        >
                            <p className="font-semibold text-blue-600">
                                رقم السن المحدد: {tooth.notations.fdi}
                            </p>
                            <button
                                onClick={() => handleAddProcedureClick(tooth)}
                                className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                            >
                                إضافة إجراء
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm && selectedTooth && (
                <form onSubmit={handleSaveProcedure} className="space-y-4">
                    <div className=''>
                    <h1 className='font-medium px-2 p-4 text-gray-700'>إضافة إجراء على السن</h1>
                    <label className='mb-2 block text-gray-700'>المعالجات على الأسنان</label>
                    <div className='grid grid-cols-1 md:grid-cols-5 gap-2'>
                        {Array.isArray(services_category) &&
                        services_category.length > 0 &&
                        services_category.map((category) => (
                            <FormSelect
                                key={category.id}
                                label={`${category.name}`}
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
                                        setData('name', selectedService.name);
                                        setData(
                                            'cost',
                                            selectedService.price.toString(),
                                        );
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
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                         <FormSelect
                        label="الحالة"
                        name="status"
                        value={data.status}
                        onChange={(val) => setData('status', val)}
                        options={[
                            { value: 'planned', label: 'مخطط' },
                            { value: 'in_progress', label: 'قيد التنفيذ' },
                            { value: 'completed', label: 'مكتمل' },
                            { value: 'cancelled', label: 'ملغي' },
                        ]}
                        error={errors.status}
                    />
                    <FormInput
                        label="اسم الإجراء"
                        name="name"
                        value={data.name}
                        onChange={(val) => setData('name', val)}
                        placeholder="اسم الإجراء"
                        error={errors.name}
                    />

                    <FormInput
                        label="كلفة الإجراء"
                        name="cost"
                        value={data.cost}
                        onChange={(val) => setData('cost', val)}
                        placeholder="كلفة الإجراء"
                        error={errors.cost}
                    />
                    <FormInput
                        label="وصف الإجراء"
                        name="description"
                        value={data.description}
                        onChange={(val) => setData('description', val)}
                        placeholder="وصف الإجراء"
                        error={errors.description}
                    />

                    {/* المريض والسن */}
                    <FormInput
                        label="اسم المريض"
                        value={patient.name}
                        disabled={true}
                    />
                    <input type="hidden" name="patient_id" value={patient.id} />

                    <FormInput
                        label="السن المحدد"
                        value={`رقم السن ${selectedTooth.notations.fdi}`}
                        disabled={true}
                    />
                    <input
                        type="hidden"
                        name="tooth_id"
                        value={selectedTooth.id}
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
                    </div>
                </form>
            )}

            {/* {Object.keys(proceduresByTooth).length > 0 && (
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
            )} */}
        </div>
    );
}
