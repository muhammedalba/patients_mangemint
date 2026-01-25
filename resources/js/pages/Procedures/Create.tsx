import {
    Activity,
    CalendarDays,
    CheckCircle,
    DollarSign,
    FileText,
    Layers,
    User,
} from 'lucide-react';

import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Patient, ServiceCategory, Service } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function CreateProcedure({
    patient_id,
    patients,
    services_category,
}: {
    patient_id?: number;
    patients: Patient[];
    services_category: ServiceCategory[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        status: 'planned',
        cost: '',
        tooth_id: '',
        patient_id: patient_id?.toString() || '',
        category: '',
        service_id: '',
        processing_date: new Date().toISOString().split('T')[0],
    });

    const [selectedPatientName, setSelectedPatientName] = useState('');
    const { success, error, warning } = useAppToast();

    const handleServiceSelect = useCallback(
        (service: Service, categoryId: string) => {
            setData('name', service.name);
            setData('cost', service.price.toString());
            setData('service_id', service.id.toString());
            setData('category', categoryId);
        },
        [setData],
    );

    const handlePatientSelect = useCallback(
        (patient: Patient) => {
            setSelectedPatientName(patient.name);
            setData('patient_id', patient.id.toString());
        },
        [setData],
    );

    useEffect(() => {
        if (patients.length === 1) {
            handlePatientSelect(patients[0]);
        }
    }, [patients, handlePatientSelect]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.patient_id || !data.cost) {
            warning('يرجى إدخال جميع الحقول');
            return;
        }
        if (!data.service_id) {
            warning('يرجى اختيار الخدمة');
            return;
        }
        post(route('procedures.store'), {
            onSuccess: () =>
                success(
                    'تم حفظ الإجراء بنجاح',
                    'تمت إضافة الإجراء الطبي للمريض',
                ),
            onError: () => error('فشل الحفظ', 'يرجى التحقق من البيانات'),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الإجراءات', href: route('procedures.index') },
        { title: 'إضافة إجراء', href: route('procedures.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة إجراء طبي" />

            <div className="mx-auto mt-10 max-w-6xl rounded-2xl bg-linear-to-br from-blue-50 to-white p-1 shadow-xl">
                <div className="rounded-2xl bg-white p-8">
                    <div className="mb-8 text-center">
                        <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                            إضافة إجراء طبي لعيادة الأسنان
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            سجل احترافي للمعالجات والخدمات الطبية
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Treatment Categories */}
                        <section className="rounded-xl border bg-gray-50 p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Layers className="h-4 w-4 text-blue-500" />
                                اختر نوع المعالجة
                            </h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6  wrap-wrap">
                                {services_category.map((category) => (
                                    <FormSelect
                                        key={category.id}
                                        label={category.name}
                                        name={`service_${category.id}`}
                                        icon={CheckCircle}
                                        value={
                                            category.services.some(
                                                (s) =>
                                                    s.id.toString() ===
                                                    data.service_id,
                                            )
                                                ? data.service_id
                                                : ''
                                        }
                                        onChange={(val) => {
                                            const selectedService =
                                                category.services.find(
                                                    (s) =>
                                                        s.id.toString() === val,
                                                );

                                            if (!selectedService) return;

                                            handleServiceSelect(
                                                selectedService,
                                                category.id.toString(),
                                            );
                                        }}
                                        options={[
                                            ...category.services.map(
                                                (service) => ({
                                                    value: service.id.toString(),
                                                    label: `${service.name} - ${service.price}`,
                                                }),
                                            ),
                                        ]}
                                        error={errors.service_id}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Procedure Details */}
                        <section className="rounded-xl border p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="h-4 w-4 text-blue-500" />
                                تفاصيل الإجراء
                            </h2>

                            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                                <FormInput
                                    label="اسم الإجراء"
                                    name="name"
                                    icon={CheckCircle}
                                    value={data.name}
                                    onChange={(v) => setData('name', v)}
                                    error={errors.name}
                                />

                                <FormInput
                                    label="كلفة الإجراء"
                                    name="cost"
                                    icon={DollarSign}
                                    value={data.cost}
                                    onChange={(v) => setData('cost', v)}
                                    error={errors.cost}
                                />

                                <FormInput
                                    label="وصف الإجراء"
                                    name="description"
                                    icon={FileText}
                                    value={data.description}
                                    onChange={(v) =>
                                        setData('description', v)
                                    }
                                    error={errors.description}
                                />
                            </div>
                        </section>

                        {/* Patient & Status */}
                        <section className="rounded-xl border bg-gray-50 p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <User className="h-4 w-4 text-blue-500" />
                                بيانات المريض والحالة
                            </h2>

                            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                                <SearchInput
                                    label="ابحث عن المريض..."
                                    name="patient_id"
                                    icon={User}
                                    value={selectedPatientName}
                                    onChange={setSelectedPatientName}
                                    options={patients}
                                    onSelect={handlePatientSelect}
                                    error={errors.patient_id}
                                />

                                <FormInput
                                    label="تاريخ المعالجة"
                                    name="processing_date"
                                    type="date"
                                    icon={CalendarDays}
                                    value={data.processing_date}
                                    onChange={(v) =>
                                        setData('processing_date', v)
                                    }
                                    error={errors.processing_date}
                                />

                                <FormSelect
                                    label="حالة الإجراء"
                                    name="status"
                                    icon={Activity}
                                    value={data.status}
                                    onChange={(val) =>
                                        setData('status', val as string)
                                    }
                                    options={[
                                        { value: 'planned', label: 'مخطط' },
                                        {
                                            value: 'in_progress',
                                            label: 'قيد التنفيذ',
                                        },
                                        {
                                            value: 'completed',
                                            label: 'مكتمل',
                                        },
                                        {
                                            value: 'cancelled',
                                            label: 'ملغي',
                                        },
                                    ]}
                                    error={errors.status}
                                />
                            </div>
                        </section>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('procedures.index')}
                                className="rounded-xl border border-gray-200 px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                إلغاء
                            </Link>

                            <FormButton
                                processing={processing}
                                label="حفظ الإجراء"
                                loadingLabel="جارِ الحفظ..."
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
