import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormTextArea } from '@/components/FormTextArea';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Patient } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BadgeQuestionMark, ClipboardList, DecimalsArrowRight, User2 } from 'lucide-react';
import { FormEvent, useState, useCallback } from 'react';
import { route } from 'ziggy-js';

interface CreateTeethProps {
    patients: Patient[];
    patient_id?: number;
}

export default function CreateTeeth({ patients, patient_id }: CreateTeethProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        patient_id: string;
        tooth_number: string;
        status: string;
        notes: string;
    }>({
        patient_id: patient_id?.toString() || '',
        tooth_number: '',
        status: '',
        notes: '',
    });

    const [selectedPatientName, setSelectedPatientName] = useState('');

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            post(route('teeth.store'), {
                onSuccess: () => reset(),
            });
        },
        [post, reset]
    );

    const handlePatientSelect = useCallback(
        (patient: Patient) => {
            setData('patient_id', patient.id.toString());
            setSelectedPatientName(patient.name);
        },
        [setData]
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الأسنان', href: route('teeth.index') },
        { title: 'إضافة سن', href: route('teeth.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة سن" />
            <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-slate-100 bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800">إضافة سن جديد</h1>
                        <p className="text-sm text-slate-500">
                            أدخل بيانات السن وحالة المريض بدقة
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SearchInput
                            label="ابحث باسم المريض"
                            name="patient_id"
                            value={selectedPatientName}
                            onChange={setSelectedPatientName}
                            options={patients}
                            onSelect={handlePatientSelect}
                            error={errors.patient_id}
                            icon={User2}
                        />

                        <FormInput
                            label="رقم السن"
                            name="tooth_number"
                            value={data.tooth_number}
                            onChange={(val: string) => setData('tooth_number', val)}
                            icon={DecimalsArrowRight}
                            error={errors.tooth_number}
                        />

                        <FormInput
                            label="الحالة الحالية للسن"
                            name="status"
                            value={data.status}
                            onChange={(val: string) => setData('status', val)}
                            error={errors.status}
                            icon={BadgeQuestionMark}
                        />

                        <FormTextArea
                            label="أدخل ملاحظات إضافية"
                            name="notes"
                            icon={ClipboardList}
                            value={data.notes}
                            onChange={(val) => setData('notes', val)}
                            rows={2}
                            error={errors.notes}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <Link
                            href={route('teeth.index')}
                            className="rounded-xl border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            إنهاء
                        </Link>

                        <FormButton
                            processing={processing}
                            label="حفظ السن"
                            loadingLabel="جارِ الحفظ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
