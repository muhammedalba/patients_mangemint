import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Patient, Service, ServiceCategory, Tooth } from '@/types';
import { Head, router, useForm, Link } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';


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
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        cost: string;
        tooth_id: string;
        patient_id: string;
        category: string;
    }>({
        name: '',
        description: '',
        cost: '',
        tooth_id: teeth[0]?.id?.toString() || '',
        patient_id: patient_id?.toString() || '',
        category: '',
    });

    const [selectedTreatment, setSelectedTreatment] = useState<Service | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [filteredTeeth, setFilteredTeeth] = useState(teeth);
console.log( patients,' $patients');

    const handleServiceSelect = (service: { name: string; price: number }) => {
        setData('name', service.name);
        setData('cost', service.price.toString());
    };

    const handlePatientSelect = async (patientId: string) => {
        setData('patient_id', patientId);
        try {
            const response = await axios.get(
                route('procedures.getTeeth', { patient: patientId }),
            );
            if (response.data.teeth && Array.isArray(response.data.teeth)) {
                setFilteredTeeth(response.data.teeth);
                setData(
                    'tooth_id',
                    response.data.teeth[0]?.id?.toString() || '',
                );
            } else {
                setFilteredTeeth([]);
                setData('tooth_id', '');
            }
        } catch {
            setFilteredTeeth([]);
            setData('tooth_id', '');
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.post(route('procedures.store'), data, {
            onSuccess: () => reset(),
            onFinish: () => setIsLoading(false),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الإجراءات', href: route('procedures.index') },
        { title: 'إضافة إجراء ', href: route('procedures.create') },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title=" إضافة إجراء" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-4 px-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة إجراء جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            onChange={(e) => setData('name', e.target.value)}
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
                        <label
                            htmlFor="description"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSelect
                        label=" اسم المريض"
                        name="patient_id"
                        value={data.patient_id}
                        onChange={(val) => handlePatientSelect(val)}
                        options={
                            patients.length > 0
                                ? patients.map((p) => ({
                                      value: p.id.toString(),
                                      label: p.name,
                                  }))
                                : [{ value: '', label: 'لا يوجد مرضى' }]
                        }
                        error={errors.patient_id}
                    />

                    <FormSelect
                        label=" اسم السن"
                        name="tooth_id"
                        value={data.tooth_id}
                        onChange={(val) => setData('tooth_id', val)}
                        options={
                            filteredTeeth && filteredTeeth.length > 0
                                ? filteredTeeth.map((tooth) => ({
                                      value: tooth.id.toString(),
                                      label: tooth.tooth_number,
                                  }))
                                : [{ value: '', label: 'لا توجد أسنان متاحة' }]
                        }
                        error={errors.tooth_id}
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
            </div>
        </AppLayout>
    );
}
