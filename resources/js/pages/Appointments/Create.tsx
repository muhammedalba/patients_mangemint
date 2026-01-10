import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    PageProps,
    Patient,
    Service,
    ServiceCategory,
    User,
} from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Create({
    patients,
    doctors,
    services,
}: PageProps<{
    patients: Patient[];
    doctors: User[];
    services: ServiceCategory[];
}>) {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: '',
        service_id: '',
        user_id: '',
        date: '',
        start_time: '',
        notes: '',
        duration_slots: 1,
        status: 'scheduled',
        category: '',
        name: '',
    });
    console.log(errors);

    const [availableAppointments, setAvailableAppointments] = useState<
        { start: string; end: string }[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPatientName, setSelectedPatientName] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>();

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatientId(patient.id);
          setSelectedPatientName(patient.name);
        setData('patient_id', patient.id.toString());
    };
    useEffect(() => {
      if (patients.length === 1) {
        const patient = patients[0];
        setSelectedPatientId(patient.id);
        setSelectedPatientName(patient.name);
        setData('patient_id', patient.id.toString());
      }
    }, [patients]);


    const fetchAvailableAppointments = async () => {
        if (!data.date) {
            setAvailableAppointments([]);
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
            console.log(response.data);

            setAvailableAppointments(response.data?.available_appointments);
        } catch (err) {
            console.error(err);
            setAvailableAppointments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableAppointments();
        return () => {
            setData('start_time', '');
        };
    }, [data.date, data.duration_slots, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('appointments.store'));
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'المواعيد',
            href: route('appointments.index'),
        },
        {
            title: 'إضافة موعد',
            href: route('appointments.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة موعد " />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-4 px-6 shadow-lg">
                <h1 className="mt-2 text-center text-xl font-bold text-gray-700">
                    إضافة موعد جديد
                </h1>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

                            <FormSelect
                                label="اسم الطبيب"
                                name="user_id"
                                value={data.user_id}
                                onChange={(val: string) =>
                                    setData('user_id', val)
                                }
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
                                onChange={(val: string) =>
                                    setData('status', val)
                                }
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
                                label="ملاحظات"
                                name="notes"
                                type="text"
                                value={data.notes}
                                onChange={(val) => setData('notes', val)}
                                placeholder="ملاحظات"
                                error={errors.notes}
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <Link
                                href={route('appointments.index')}
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
