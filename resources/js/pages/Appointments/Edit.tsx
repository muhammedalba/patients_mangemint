import LoadingPage from '@/components/LoadingPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
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
import { Appointment, PageProps, Patient, Procedure, User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Edit({
    appointment,
    patients,
    doctors,
    services,
}: PageProps<{
    appointment: Appointment;
    patients: Patient[];
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

    // جلب الأوقات المتاحة عند اختيار التاريخ أو تغيير duration_slots
    const fetchAvailableSlots = async (
        selectedDate: string,
        durationSlots: number,
    ) => {
        if (!selectedDate) return;

        setIsLoading(true);
        try {
            const response = await axios.get(
                route('appointments.availableSlots'),
                {
                    params: {
                        date: selectedDate,
                        duration_slots: data.duration_slots,
                    },
                },
            );
            const slots = await response.data?.available_appointments;
            setAvailableAppointments(slots);
        } catch (error) {
            console.error('Failed to fetch available slots', error);
            setAvailableAppointments([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setData('date', selectedDate);
        fetchAvailableSlots(selectedDate, data.duration_slots);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const duration = Number(e.target.value);
        setData('duration_slots', duration);
        if (data.date) fetchAvailableSlots(data.date, duration);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData('start_time', e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        put(route('appointments.update', appointment.id), {
            onFinish: () => setIsLoading(false),
        });
    };

    if (isLoading) return <LoadingPage />;

    return (
        <AppLayout>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Patient */}
                        <div>
                            <Label htmlFor="patient_id">Patient</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('patient_id', value)
                                }
                                value={data.patient_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a patient" />
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
                                <p className="text-red-500">
                                    {errors.patient_id}
                                </p>
                            )}
                        </div>

                        {/* Doctor */}
                        <div>
                            <Label htmlFor="user_id">Doctor</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('user_id', value)
                                }
                                value={data.user_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
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
                                <p className="text-red-500">{errors.user_id}</p>
                            )}
                        </div>

                        {/* Service */}
                        <div>
                            <Label htmlFor="service_id">Service</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('service_id', value)
                                }
                                value={data.service_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a service" />
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
                                <p className="text-red-500">
                                    {errors.service_id}
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <Label htmlFor="date">Appointment Date</Label>
                            <Input
                                type="date"
                                value={
                                    data.date ? data.date.substring(0, 10) : ''
                                }
                                onChange={handleDateChange}
                            />
                            {errors.date && (
                                <p className="text-red-500">{errors.date}</p>
                            )}
                        </div>

                        {/* Duration Slots */}
                        <div>
                            <Label htmlFor="duration_slots">
                                Duration Slots
                            </Label>
                            <input
                                type="number"
                                value={data.duration_slots}
                                onChange={handleDurationChange}
                                className="w-full rounded-md border px-3 py-2"
                            />
                            {errors.duration_slots && (
                                <p className="text-red-500">
                                    {errors.duration_slots}
                                </p>
                            )}
                        </div>

                        {/* Available Start Times */}
                        <div>
                            <Label htmlFor="start_time">Start Time</Label>
                            <select
                                value={data.start_time}
                                onChange={handleTimeChange}
                                className="w-full rounded-md border px-3 py-2"
                            >
                                {availableAppointments.length > 0 ? (
                                    availableAppointments.map((slot: any) => (
                                        <option
                                            key={slot.start}
                                            value={slot.start}
                                        >
                                            {slot.start} - {slot.end}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>
                                        Select a date first
                                    </option>
                                )}
                            </select>
                            {errors.start_time && (
                                <p className="text-red-500">
                                    {errors.start_time}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    setData('status', value as any)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
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
                                <p className="text-red-500">{errors.status}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                className="w-full rounded-md border px-3 py-2"
                            />
                            {errors.notes && (
                                <p className="text-red-500">{errors.notes}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('appointments.index')}>
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
