import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import LoadingPage from '@/components/LoadingPage';
import { Label } from '@/components/ui/label';
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
    console.log(procedures, 'procedures');

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
                        <FormSelect
                            label="اسم المريض"
                            name="patient_id"
                            value={data.patient_id}
                            onChange={(val: string) =>
                                setData('patient_id', val)
                            }
                            options={patients.map((patient) => ({
                                value: String(patient.id),
                                label: patient.name,
                            }))}
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

                        <FormSelect
                            label="اسم المعالجة"
                            name="procedure_id"
                            value={data.procedure_id}
                            onChange={(val: string) =>
                                setData('procedure_id', val)
                            }
                            options={procedures.map((procedure) => ({
                                value: String(procedure.id),
                                label: procedure.name,
                            }))}
                            error={errors.procedure_id}
                        />

                        <FormInput
                            label="تاريخ الموعد"
                            name="appointment_date"
                            type="date"
                            value={data.appointment_date}
                            onChange={(e) =>
                                setData('appointment_date', e.target.value)
                            }
                            error={errors.appointment_date}
                        />

                        <FormSelect
                            label="توقيت الموعد"
                            name="times"
                            value={data.times}
                            onChange={(val) => setData('times', val)}
                            options={timeSlots.map((slot) => ({
                                value: slot.value,
                                label: slot.display,
                            }))}
                            error={errors.times}
                            multiple
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

                        <div>
                            <label
                                htmlFor="notes"
                                className="mb-2 block text-gray-700"
                            >
                                الملاحظات
                            </label>
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
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
