import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

interface Tooth {
    id: number;
    name: string;
    tooth_number: string;
}

interface Patient {
    id: number;
    name: string;
}

interface Service {
    id: number;
    name: string;
    price: number;
}

interface ServiceCategory {
    id: number;
    name: string;
    services: Service[];
}

export default function CreateProcedure({
    teeth,
    patient_id,
    patients,
    services_category,
}: {
    teeth: Tooth[];
    patient_id?: number;
    patients: Patient[];
    services_category: ServiceCategory[];
}) {
    const { data, setData, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        cost: string;
        tooth_id: string;
        patient_id: string;
    }>({
        name: '',
        description: '',
        cost: '',
        tooth_id: teeth[0]?.id?.toString() || '',
        patient_id: patient_id?.toString() || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [filteredTeeth, setFilteredTeeth] = useState(teeth);

    const handleServiceSelect = (service: { name: string; price: number }) => {
        console.log('Selected Service:', service); // Debugging log
        setData('name', service.name);
        setData('cost', service.price.toString());
    };

    const handlePatientSelect = async (patientId: string) => {
        setData('patient_id', patientId);
        console.log('Selected Patient ID:', patientId); // Debugging log

        try {
            const response = await axios.get(
                route('procedures.getTeeth', { patient: patientId }),
            );
            console.log('Response:', response.data); // Log the response for debugging

            if (response.data.teeth && Array.isArray(response.data.teeth)) {
                setFilteredTeeth(response.data.teeth);
                setData(
                    'tooth_id',
                    response.data.teeth[0]?.id?.toString() || '',
                );
            } else {
                console.error('Teeth data is missing or invalid');
                setFilteredTeeth([]);
                setData('tooth_id', '');
            }
        } catch (error) {
            console.error('Error fetching teeth:', error);
            setFilteredTeeth([]);
            setData('tooth_id', '');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(data, 'data');

        try {
            router.post(route('procedures.store'), data, {
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

    const patient =
        patients && patients.length > 0 ? (
            patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                    {patient.name}
                </option>
            ))
        ) : (
            <option key="no-patients" value={patients.id}>
                {' '}
                {patients.name}{' '}
            </option>
        );
    const tooth =
        teeth && teeth.length > 0 ? (
            teeth.map((tooth) => (
                <option key={tooth.id} value={tooth.id}>
                    {tooth.tooth_number}
                </option>
            ))
        ) : (
            <option key="no-teeth" value={teeth.id}>
                {' '}
                {teeth.name}{' '}
            </option>
        );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Procedure" />
            <div className="mx-auto mt-4 w-3xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة إجراء جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {services_category.map((category) => (
                        <div key={category.id} className="mb-4">
                            <label className="block text-right text-gray-700">
                                اختر خدمة من {category.name}
                            </label>
                            <select
                                title={`اختر خدمة من ${category.name}`}
                                onChange={(e) => {
                                    const selectedService =
                                        category.services.find(
                                            (service) =>
                                                service.id ===
                                                parseInt(e.target.value),
                                        );
                                    if (selectedService) {
                                        handleServiceSelect(selectedService);
                                    }
                                }}
                                className="w-full rounded-lg border px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="" disabled>
                                    اختر خدمة من {category.name}
                                </option>
                                {category.services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <div>
                        <label className="mt-4 block text-right text-gray-700">
                            اسم الإجراء
                        </label>
                        <input
                            type="text"
                            name="name"
                            title="اسم الإجراء"
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
                            title="كلفة الإجراء"
                            value={data.cost}
                            onChange={(e) => setData('cost', e.target.value)}
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
                            title="وصف الإجراء"
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
                            title="اختر المريض"
                            value={data.patient_id}
                            onChange={(e) =>
                                handlePatientSelect(e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">select patient </option>

                            {patient}
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
                            title="اختر السن"
                            value={data.tooth_id}
                            onChange={(e) =>
                                setData('tooth_id', e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="" disabled>
                                اختر السن
                            </option>
                            {filteredTeeth?.length > 0 ? (
                                filteredTeeth.map((tooth) => (
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
