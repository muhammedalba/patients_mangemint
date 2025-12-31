import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
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
    console.log('patients', patients);

    const [selectedTreatment, setSelectedTreatment] = useState<Service | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [filteredTeeth, setFilteredTeeth] = useState(teeth);
    const [selectedPatientName, setSelectedPatientName] = useState('');

    const handleServiceSelect = (service: { name: string; price: number }) => {
        setData('name', service.name);
        setData('cost', service.price.toString());
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatientName(patient.name);
        setData('patient_id', patient.id);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(data);

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
            <Head title="Create Procedure" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-4 px-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة إجراء جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormSelect
                            label="الحالة"
                            name="status"
                            value={data.status}
                            onChange={(val) => setData('status', val as string)}
                            options={[
                                { value: 'planned', label: 'مخطط' },
                                {
                                    value: 'in_progress',
                                    label: 'قيد التنفيذ',
                                },
                                { value: 'completed', label: 'مكتمل' },
                                { value: 'cancelled', label: 'ملغي' },
                            ]}
                            error={errors.status}
                        />
                    </div>
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

                    <FormInput
                        label=" اسم الإجراء"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e)}
                        placeholder="الاسم الإجراء"
                        error={errors.name}
                    />

                    {selectedTreatment && (
                        <FormInput
                            label=" المعالجة المختارة"
                            name="treatment_name"
                            value={selectedTreatment.name}
                            onChange={(e) => setData('name', e)}
                            placeholder="المعالجة المختارة"
                        />
                    )}

                    <FormInput
                        label=" كلفة الإجراء"
                        name="cost"
                        value={data.cost}
                        onChange={(e) => setData('cost', e)}
                        placeholder="كلفة الإجراء"
                    />

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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SearchInput
                            label="اسم المريض"
                            name="patient_id"
                            value={selectedPatientName}
                            onChange={(val) => setSelectedPatientName(val)}
                            options={patients}
                            onSelect={handlePatientSelect}
                            placeholder="ابحث باسم المريض..."
                            error={errors.patient_id}
                        />

                        <FormInput
                            label="تاريخ المعالجة"
                            name="processing_date"
                            type="date"
                            // max={new Date().toISOString().split('T')[0]}
                            value={data.processing_date}
                            onChange={(e) => setData('processing_date', e)}
                            error={errors.processing_date}
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
