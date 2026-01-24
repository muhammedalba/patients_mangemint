import {
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
import { FormTextArea } from '@/components/FormTextArea';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    Procedure,
    Service,
    ServiceCategory,
    Tooth,
} from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function EditProcedure({
    procedure,
    teeth,
    services_category,
    patient,
}: {
    procedure: Procedure;
    teeth: Tooth[];
    services_category: ServiceCategory[];
    patient: { id: string; name: string };
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: procedure.name || '',
        description: procedure.description || '',
        status: procedure.status || 'planned',
        cost: procedure.cost || '',
        tooth_id: procedure.tooth_id || '',
        category: procedure.category || '',
        processing_date: procedure.processing_date
            ? procedure.processing_date.split(' ')[0]
            : '',
        service_id: procedure.service_id?.toString() || '',
        patient_id: procedure.patient_id?.toString() || '',
    });

    const { success, error } = useAppToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('procedures.update', procedure.id), {
            onSuccess: () => success('تم تعديل الإجراء بنجاح'),
            onError: () =>
                error('فشل تعديل الإجراء', 'يرجى التحقق من البيانات المدخلة'),
        });
    };

    const handleServiceSelect = (service: Service, categoryId: string) => {
        console.log(service);
        
        setData('name', service.name);
        setData('cost', service.price.toString());
        setData('service_id', service.id.toString());
        setData('category', categoryId);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الإجراءات', href: route('procedures.index') },
        {
            title: 'تعديل الإجراء',
            href: route('procedures.edit', procedure.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل الإجراء" />

            <div className="mx-auto mt-10 max-w-6xl rounded-2xl bg-linear-to-br from-blue-50 to-white p-1 shadow-xl">
                <div className="rounded-2xl bg-white p-8">
                    <div className="mb-8 text-center">
                        <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                            تعديل إجراء طبي
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            عدّل بيانات الإجراء الحالي في عيادة الأسنان
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Service Categories */}
                        <section className="rounded-xl border bg-gray-50 p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Layers className="h-4 w-4 text-blue-500" />
                                اختر نوع المعالجة
                            </h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                                   {services_category.map((category) => (
            <FormSelect
                key={category.id}
                label={category.name}
                name={`service_${category.id}`}
                icon={CheckCircle}
                value={data.service_id || ''}
                onChange={(val) => {
                    const selectedService = category.services.find(
                        (s) => s.id.toString() === val
                    );

                    if (!selectedService) return;

                    handleServiceSelect(
                        selectedService,
                        category.id.toString()
                    );
                }}
                options={[
                    { value: '', label: 'اختر خدمة' },
                    ...category.services.map((service) => ({
                        value: service.id.toString(),
                        label: `${service.name} - ${service.price}`,
                    })),
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

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                                    value={data.cost.toString()}
                                    onChange={(v) => setData('cost', v)}
                                    error={errors.cost}
                                />
                                <FormTextArea
                                    label="وصف الإجراء"
                                    name="description"
                                    value={data.description}
                                    onChange={(v) => setData('description', v)}
                                    error={errors.description}
                                    rows={2}
                                />
                            </div>
                        </section>

                        {/* Tooth & Status */}
                        <section className="rounded-xl border bg-gray-50 p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <User className="h-4 w-4 text-blue-500" />
                                معلومات إضافية
                            </h2>

                            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                                <FormInput
                                    label="المريض"
                                    name="patient_id"
                                    type="text"
                                    icon={User}
                                    value={patient?.name.toString() || ''}
                                    disabled
                                    onChange={(v) => setData('patient_id', v)}
                                    error={errors.patient_id}
                                />
                                <FormSelect
                                    label="اختر السن المعالج"
                                    name="tooth_id"
                                    value={data.tooth_id.toString()}
                                    onChange={(val) =>
                                        setData('tooth_id', val.toString())
                                    }
                                    icon={CheckCircle}
                                    error={errors.tooth_id}
                                    options={[
                                        ...teeth.map((t) => ({
                                            label: t.tooth_number,
                                            value: t.id,
                                        })),
                                    ]}
                                />
                                <FormInput
                                    label="تاريخ المعالجة"
                                    name="processing_date"
                                    type="date"
                                    icon={CalendarDays}
                                    value={data?.processing_date}
                                    onChange={(v) =>
                                        setData('processing_date', v)
                                    }
                                    error={errors.processing_date}
                                />
                                <FormSelect
                                    label="الحالة"
                                    name="status"
                                    value={data.status}
                                    onChange={(val) =>
                                        setData('status', val.toString())
                                    }
                                    error={errors.status}
                                    options={[
                                        { label: 'مخطط', value: 'planned' },
                                        {
                                            label: 'قيد التنفيذ',
                                            value: 'in_progress',
                                        },
                                        { label: 'مكتمل', value: 'completed' },
                                        { label: 'ملغي', value: 'cancelled' },
                                    ]}
                                />
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('procedures.index')}
                                className="rounded-xl border border-gray-200 px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                إلغاء
                            </Link>

                            <FormButton
                                processing={processing}
                                label="تحديث الإجراء"
                                loadingLabel="جارِ التحديث..."
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
