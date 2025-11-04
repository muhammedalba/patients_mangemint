import LoadingPage from '@/components/LoadingPage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Patient, Procedure, User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 21; i++) {
        // From 9 AM to 9 PM
        for (let j = 0; j < 60; j += 30) {
            const displayHour = i % 12 === 0 ? 12 : i % 12;
            const ampm = i < 12 || i === 24 ? 'AM' : 'PM';
            const minutes = j === 0 ? '00' : String(j);
            const valueHour = i < 10 ? `0${i}` : String(i);
            const valueMinutes = j === 0 ? '00' : String(j);
            slots.push({
                display: `${displayHour}:${minutes} ${ampm}`,
                value: `${valueHour}:${valueMinutes}`,
            });
        }
    }
    return slots;
};

const timeSlots = generateTimeSlots();

export default function Create({
    patients,
    doctors,
    procedures,
}: PageProps<{
    patients: Patient[];
    doctors: User[];
    procedures: Procedure[];
}>) {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: '',
        user_id: '',
        procedure_id: '',
        appointment_date: '',
        times: [],
        notes: '',
        status: 'scheduled',
    });
    const [isLoading, setIsLoading] = useState(false);
console.log(procedures,'procedures');

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => option.value,
        );
        setData('times', selectedOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            post(route('appointments.store'));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
                        <div>
                            <Label
                                htmlFor="patient_id"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                اسم المريض
                            </Label>
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

                        <div>
                            <Label
                                htmlFor="user_id"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                اسم الطبيب
                            </Label>
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

                        <div>
                            <Label
                                htmlFor="procedure_id"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                المعالجة
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('procedure_id', value)
                                }
                                value={data.procedure_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a procedure" />
                                </SelectTrigger>
                                <SelectContent>
                                    {procedures.map((procedure) => (
                                        <SelectItem
                                            key={procedure.id}
                                            value={String(procedure.id)}
                                        >
                                            {procedure.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.procedure_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.procedure_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label
                                htmlFor="appointment_date"
                                className="block text-sm font-medium text-gray-800"
                            >
                                تاريخ الموعد
                            </label>
                            <input
                                id="appointment_date"
                                name="appointment_date"
                                type="date"
                                value={data.appointment_date}
                                onChange={(e) =>
                                    setData('appointment_date', e.target.value)
                                }
                                placeholder="Appointment date"
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            {errors.appointment_date && (
                                <p className="text-xs text-red-500">
                                    {errors.appointment_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                htmlFor="times"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                توقيت الموعد
                            </Label>
                            <select
                                id="times"
                                multiple
                                value={data.times}
                                onChange={handleTimeChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                {timeSlots.map((slot) => (
                                    <option key={slot.value} value={slot.value}>
                                        {slot.display}
                                    </option>
                                ))}
                            </select>
                            {errors.times && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.times}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                htmlFor="status"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                حالة الموعد
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('status', value)
                                }
                                value={data.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
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

                        <div>
                            <Label
                                htmlFor="notes"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                ملاحظات
                            </Label>
                            <textarea
                                name="notes"
                                placeholder="ملاحظات"
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            {errors.notes && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <Button
                                variant="outline"
                                asChild
                                className={`rounded-lg px-6 py-2 font-semibold transition-all duration-200 ${
                                    processing
                                        ? 'cursor-not-allowed bg-white'
                                        : 'bg-gray-200 hover:bg-gray-200'
                                }`}
                            >
                                <Link
                                    href={route('appointments.index')}
                                    className="text-gray-700"
                                >
                                    إنهاء
                                </Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-200 ${
                                    processing
                                        ? 'cursor-not-allowed bg-blue-400'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {processing ? 'جارِ الحفظ ... ' : 'حفظ'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
