import {
    CalendarDays,
    CheckCircle,
    ClipboardList,
    Clock,
    Stethoscope,
    Timer,
    User,
} from 'lucide-react';

import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { FormTextArea } from '@/components/FormTextArea';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User as Doctor, PageProps, Patient } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Create({
    patients,
    doctors,
}: PageProps<{
    patients: Patient[];
    doctors: Doctor[];
}>) {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: null as string | null,
        user_id: null as number | null,
        date: '',
        start_time: '',
        notes: '',
        duration_slots: 1,
        status: 'scheduled',
    });

    const [availableAppointments, setAvailableAppointments] = useState<
        { start: string; end: string }[]
    >([]);
    const [selectedPatientName, setSelectedPatientName] = useState('');
    const { success, error } = useAppToast();

    const handlePatientSelect = useCallback((patient: Patient) => {
        setSelectedPatientName(patient.name);
        setData('patient_id', patient.id.toString());
    }, [setData]);

    useEffect(() => {
        if (patients.length === 1) {
            handlePatientSelect(patients[0]);
        }
    }, [patients, handlePatientSelect]);

    const fetchAvailableAppointments = useCallback(async () => {
        if (!data.date) {
            setAvailableAppointments([]);
            return;
        }

        try {
            const response = await axios.get(
                route('appointments.availableSlots'),
                {
                    params: {
                        date: data.date,
                        duration_slots: data.duration_slots,
                    },
                },
            );

            setAvailableAppointments(
                response.data?.available_appointments ?? [],
            );
        } catch {
            setAvailableAppointments([]);
        }
    }, [data.date, data.duration_slots]);

    useEffect(() => {
        fetchAvailableAppointments();
        return () => {
            setData('start_time', '');
        };
    }, [fetchAvailableAppointments, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: () =>
                success(
                    'تم حفظ الموعد بنجاح',
                    'تمت إضافة الموعد إلى جدول المواعيد',
                ),
            onError: () =>
                error('فشل حفظ الموعد', 'يرجى التحقق من البيانات المدخلة'),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المواعيد', href: route('appointments.index') },
        { title: 'إضافة موعد', href: route('appointments.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="حجز موعد طبيب أسنان" />

            <div className="mx-auto mt-10 max-w-6xl rounded-2xl bg-linear-to-br from-blue-50 to-white p-1 shadow-xl">
                <div className="rounded-2xl bg-white p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
                            <Stethoscope className="h-6 w-6 text-blue-600" />
                            حجز موعد طبيب الأسنان
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            إدارة احترافية لمواعيد المرضى
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Patient Info */}
                        <section className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-600">
                                <User className="h-4 w-4 text-blue-500" />
                                معلومات المريض
                            </h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <SearchInput
                                    label="ابحث باسم المريض..."
                                    name="patient_id"
                                    icon={User}
                                    value={selectedPatientName}
                                    onChange={setSelectedPatientName}
                                    options={patients}
                                    onSelect={handlePatientSelect}
                                    placeholder=""
                                    error={errors.patient_id}
                                />

                                <FormSelect
                                    label="اسم الطبيب"
                                    name="user_id"
                                    icon={Stethoscope}
                                    value={String(data.user_id ?? '')}
                                    onChange={(val) =>
                                        setData(
                                            'user_id',
                                            val ? Number(val) : null,
                                        )
                                    }
                                    options={doctors.map((doctor) => ({
                                        value: doctor.id.toString(),
                                        label: doctor.name,
                                    }))}
                                    error={errors.user_id}
                                />
                            </div>
                        </section>

                        {/* Appointment Details */}
                        <section className="rounded-xl border border-gray-100 bg-white p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-600">
                                <CalendarDays className="h-4 w-4 text-blue-500" />
                                تفاصيل الموعد
                            </h2>

                            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                                <FormInput
                                    label="تاريخ الموعد"
                                    name="date"
                                    type="date"
                                    icon={CalendarDays}
                                    value={data.date}
                                    onChange={(val) => setData('date', val)}
                                    error={errors.date}
                                />

                                <FormSelect
                                    label="وقت الموعد"
                                    name="start_time"
                                    icon={Clock}
                                    value={data.start_time}
                                    onChange={(val) =>
                                        !Array.isArray(val) &&
                                        setData('start_time', val)
                                    }
                                    options={[
                                        {
                                            value: '',
                                            label: 'اختر الوقت',
                                        },
                                        ...availableAppointments.map(
                                            (slot) => ({
                                                value: slot.start,
                                                label: `${slot.start} - ${slot.end}`,
                                            }),
                                        ),
                                    ]}
                                    error={errors.start_time}
                                />

                                <FormInput
                                    label="مدة الموعد"
                                    name="duration_slots"
                                    type="number"
                                    icon={Timer}
                                    value={String(data.duration_slots)}
                                    onChange={(val) =>
                                        setData('duration_slots', Number(val))
                                    }
                                    error={errors.duration_slots}
                                />
                            </div>
                        </section>

                        {/* Additional Info */}
                        <section className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                            <h2 className="mb-10 flex items-center gap-2 text-sm font-semibold text-gray-600">
                                <ClipboardList className="h-4 w-4 text-blue-500" />
                                معلومات إضافية
                            </h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
                                <FormSelect
                                    label="حالة الموعد"
                                    name="status"
                                    icon={CheckCircle}
                                    value={data.status}
                                    onChange={(val) =>
                                        !Array.isArray(val) &&
                                        setData('status', val)
                                    }
                                    options={[
                                        {
                                            value: 'scheduled',
                                            label: 'مجدول',
                                        },
                                        {
                                            value: 'completed',
                                            label: 'مكتمل',
                                        },
                                        {
                                            value: 'canceled',
                                            label: 'ملغي',
                                        },
                                    ]}
                                    error={errors.status}
                                />

                                <FormTextArea
                                    label="ملاحظات الطبيب"
                                    name="notes"
                                    icon={ClipboardList}
                                    value={data.notes}
                                    onChange={(val) => setData('notes', val)}
                                    error={errors.notes}
                                    rows={4}

                                />
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('appointments.index')}
                                className="rounded-xl border border-gray-200 px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                إلغاء
                            </Link>

                            <FormButton
                                processing={processing}
                                label="تأكيد الحجز"
                                loadingLabel="جارِ الحفظ..."
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
