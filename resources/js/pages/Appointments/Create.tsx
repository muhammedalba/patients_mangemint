import LoadingPage from '@/components/LoadingPage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Patient, Procedure, User } from '@/types';
import { useForm } from '@inertiajs/react';
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
    services: Procedure[];
}>) {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: '',
        user_id: '',
        service_id: '',
        date: '',
        start_time: '',
        notes: '',
        duration_slots: 1,
        status: 'scheduled',
    });

    const [availableAppointments, setAvailableAppointments] = useState<
        { start: string; end: string }[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);

    // جلب المواعيد المتاحة عند تغيير التاريخ أو مدة الحجز
    const fetchAvailableAppointments = async () => {
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
        // عند تغيير التاريخ، قم بإلغاء تحديد الوقت الحالي
        // لأن قائمة الأوقات ستتغير.
        return () => {
            setData('start_time', '');
        };
    }, [data.date, data.duration_slots, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('appointments.store'));
    };

    if (isLoading) return <LoadingPage />;

    return (
        <AppLayout>
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-4 px-6 shadow-lg">
                <h1 className="mt-2 text-center text-xl font-bold text-gray-700">
                    إضافة موعد جديد
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* المريض */}
                        <div>
                            <Label htmlFor="patient_id">اسم المريض</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('patient_id', value)
                                }
                                value={data.patient_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر اسم المريض" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((patient) => (
                                        <SelectItem
                                            key={patient.id}
                                            value={String(patient.id)}
                                        >
                                            {patient.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.patient_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.patient_id}
                                </p>
                            )}
                        </div>

                        {/* الطبيب */}
                        <div>
                            <Label htmlFor="user_id">اسم الطبيب</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('user_id', value)
                                }
                                value={data.user_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر اسم الطبيب" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doctor) => (
                                        <SelectItem
                                            key={doctor.id}
                                            value={String(doctor.id)}
                                        >
                                            {doctor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.user_id}
                                </p>
                            )}
                        </div>

                        {/* الخدمة */}
                        <div>
                            <Label htmlFor="service_id">المعالجة</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('service_id', value)
                                }
                                value={data.service_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر المعالجة" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map((category) => (
                                        <SelectGroup key={category.id}>
                                            <SelectLabel>
                                                {category.name}
                                            </SelectLabel>
                                            {category.services?.map(
                                                (service) => (
                                                    <SelectItem
                                                        key={service.id}
                                                        value={String(
                                                            service.id,
                                                        )}
                                                    >
                                                        {service.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.service_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.service_id}
                                </p>
                            )}
                        </div>

                        {/* التاريخ */}
                        <div>
                            <Label htmlFor="date">تاريخ الموعد</Label>
                            <input
                                type="date"
                                id="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                                className="w-full rounded-md border px-3 py-2 text-sm"
                            />
                            {errors.date && (
                                <p className="text-xs text-red-500">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        {/* مدة الموعد */}
                        <div>
                            <Label htmlFor="duration_slots">
                                مدة الموعد (عدد الـ slots)
                            </Label>
                            <input
                                type="number"
                                id="duration_slots"
                                min={1}
                                value={data.duration_slots}
                                onChange={(e) =>
                                    setData(
                                        'duration_slots',
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full rounded-md border px-3 py-2 text-sm"
                            />
                            {errors.duration_slots && (
                                <p className="text-xs text-red-500">
                                    {errors.duration_slots}
                                </p>
                            )}
                        </div>

                        {/* اختيار الوقت */}
                        <div>
                            <Label htmlFor="start_time">توقيت الموعد</Label>
                            <select
                                id="start_time"
                                value={data.start_time}
                                onChange={(e) =>
                                    setData('start_time', e.target.value)
                                }
                                className="w-full rounded-md border px-3 py-2 text-sm"
                            >
                                <option value="">اختر الوقت</option>
                                {availableAppointments?.map((slot) => (
                                    <option key={slot.start} value={slot.start}>
                                        {slot.start} - {slot.end}
                                    </option>
                                ))}
                            </select>
                            {errors.start_time && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.start_time}
                                </p>
                            )}
                        </div>

                        {/* الحالة */}
                        <div>
                            <Label htmlFor="status">حالة الموعد</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('status', value)
                                }
                                value={data.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">
                                        Scheduled
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="canceled">
                                        Canceled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* الملاحظات */}
                        <div className="md:col-span-2">
                            <Label htmlFor="notes">ملاحظات</Label>
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                className="w-full rounded-md border px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    {/* الأزرار */}
                    <div className="flex items-center justify-end space-x-2">
                        <Button
                            variant="outline"
                            asChild
                            className="rounded-lg px-6 py-2 font-semibold"
                        >
                            <a
                                href={route('appointments.index')}
                                className="text-gray-700"
                            >
                                إنهاء
                            </a>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                            {processing ? 'جارِ الحفظ ...' : 'حفظ'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
