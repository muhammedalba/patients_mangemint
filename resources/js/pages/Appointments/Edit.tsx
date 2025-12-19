import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import LoadingPage from '@/components/LoadingPage';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import {
    Appointment,
    BreadcrumbItem,
    PageProps,
    Patient,
    Procedure,
    User,
} from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Edit({
    appointment,
    patients,
    patient,
    doctors,
    services,
}: PageProps<{
    appointment: Appointment;
    patients: Patient[];
    patient: Patient;
    doctors: User[];
    services: Procedure[];
}>) {
    const { data, setData, put, errors, processing } = useForm({
        patient_id: String(appointment.patient_id),
        user_id: String(appointment.user_id),
        service_id: String(appointment.service_id),
        date: appointment.date,
        start_time: appointment.start_time,
        duration_slots: appointment.duration_slots,
        notes: appointment.notes || '',
        status: appointment.status,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [availableAppointments, setAvailableAppointments] = useState<any[]>(
        [],
    );

    console.log(errors, 'errors');

    // جلب الأوقات المتاحة عند تغيير التاريخ أو مدة الحجز
    const fetchAvailableSlots = async () => {
        // لا ترسل الطلب إذا لم يتم تحديد التاريخ
        if (!data.date) {
            setAvailableAppointments([]); // أفرغ القائمة إذا كان التاريخ فارغًا
            return;
        }
        setIsLoading(true);
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
            setAvailableAppointments(response.data?.available_appointments);
        } catch (err) {
            console.error(err);
            setAvailableAppointments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableSlots();
    }, [data.date, data.duration_slots]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('appointments.update', appointment.id));
    };
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المواعيد', href: route('appointments.index') },
        {
            title: 'تعديل الموعد',
            href: route('appointments.edit', appointment.id),
        },
    ];

    if (isLoading || processing) return <LoadingPage />;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل الموعد " />

            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    تعديل الموعد
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SearchInput
                            label="اسم المريض"
                            name="patient_id"
                            value={
                                patients.find(
                                    (p) => p.id === Number(data.patient_id),
                                )?.name ?? ''
                            }
                            onChange={(val) => setData('patient_id', val)}
                            options={patients}
                            onSelect={(patient) =>
                                setData('patient_id', patient.id.toString())
                            }
                            placeholder="ابحث باسم المريض..."
                            error={errors.patient_id}
                        />

                        <FormSelect
                            label="اسم الطبيب"
                            name="user_id"
                            value={data.user_id}
                            onChange={(val: string) => setData('user_id', val)}
                            options={doctors.map((doctor) => ({
                                value: String(doctor.id),
                                label: doctor.name,
                            }))}
                            error={errors.user_id}
                        />

                        <FormInput
                            label="تاريخ الموعد"
                            name="date"
                            type="date"
                            value={data.date}
                            onChange={(val) => setData('date', val)}
                            error={errors.date}
                        />

                        <FormSelect
                            label="توقيت الموعد"
                            name="start_time"
                            value={data.start_time}
                            onChange={(val: string) =>
                                setData('start_time', val)
                            }
                            options={[
                                { value: '', label: 'اختر الوقت' },
                                ...(availableAppointments?.map((slot) => ({
                                    value: slot.start,
                                    label: `${slot.start} - ${slot.end}`,
                                })) ?? []),
                            ]}
                            error={errors.start_time}
                        />

                        <FormSelect
                            label="حالة الموعد"
                            name="status"
                            value={data.status}
                            onChange={(val: string) => setData('status', val)}
                            options={[
                                { value: 'scheduled', label: 'Scheduled' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'canceled', label: 'Canceled' },
                            ]}
                            error={errors.status}
                        />

                        <FormInput
                            label="مدة الموعد (عدد الـ slots)"
                            type="number"
                            name="duration_slots"
                            min={1}
                            value={String(data.duration_slots)}
                            onChange={(val: string) =>
                                setData('duration_slots', Number(val))
                            }
                            error={errors.duration_slots}
                        />

                        <FormInput
                            label="الملاحظات"
                            name="notes"
                            type="text"
                            value={data.notes}
                            onChange={(val) => setData('notes', val)}
                            placeholder="الملاحظات"
                            error={errors.notes}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('appointments.index')}
                            className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                        >
                            إلغاء
                        </Link>
                        <FormButton
                            processing={processing}
                            label="تحديث"
                            loadingLabel="جارِ التحديث ..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
