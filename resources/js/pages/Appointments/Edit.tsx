import { useForm, Link } from '@inertiajs/react';
import { PageProps, Patient, User, Procedure, Appointment } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { route } from 'ziggy-js';

const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 21; i++) { // From 9 AM to 9 PM
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

export default function Edit({  appointment, patients, doctors, procedures }: PageProps<{ appointment: Appointment, patients: Patient[], doctors: User[], procedures: Procedure[] }>) {
    const { data, setData, put, errors, processing } = useForm({
        patient_id: String(appointment.patient_id),
        user_id: String(appointment.user_id),
        procedure_id: String(appointment.procedure_id),
        appointment_date: appointment.appointment_date,
        times: appointment.times || [], // Initialize with existing times or an empty array
        notes: appointment.notes || '',
        status: appointment.status,
    });
console.log(errors);

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setData('times', selectedOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data,'data edit');

        put(route('appointments.update', appointment.id));
    };

    return (
        <AppLayout>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="patient_id">Patient</Label>
                            <Select onValueChange={(value) => setData('patient_id', value)} value={data.patient_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map(patient => (
                                        <SelectItem key={patient.id} value={String(patient.id)}>{patient.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.patient_id && <p className="text-red-500 text-xs mt-1">{errors.patient_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="user_id">Doctor</Label>
                            <Select onValueChange={(value) => setData('user_id', value)} value={data.user_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map(doctor => (
                                        <SelectItem key={doctor.id} value={String(doctor.id)}>{doctor.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="procedure_id">Procedure</Label>
                            <Select onValueChange={(value) => setData('procedure_id', value)} value={data.procedure_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a procedure" />
                                </SelectTrigger>
                                <SelectContent>
                                    {procedures.map(procedure => (
                                        <SelectItem key={procedure.id} value={String(procedure.id)}>{procedure.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.procedure_id && <p className="text-red-500 text-xs mt-1">{errors.procedure_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="appointment_date">Appointment Date</Label>
                            <Input
                                id="appointment_date"
                                type="date"
                                value={data.appointment_date}
                                onChange={(e) => setData('appointment_date', e.target.value)}
                            />
                            {errors.appointment_date && <p className="text-red-500 text-xs mt-1">{errors.appointment_date}</p>}
                        </div>

                        <div>
                            <Label htmlFor="times">Appointment Times</Label>
                            <select
                            name='times'
                                id="times"

                                title='times'
                                multiple
                                value={data.times}
                                onChange={handleTimeChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            >
                                {timeSlots.map(slot => (
                                    <option key={slot.value} value={slot.value}>
                                        {slot.display}
                                    </option>
                                ))}
                            </select>
                            {errors.times && <p className="text-red-500 text-xs mt-1">{errors.times}</p>}
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select onValueChange={(value) => setData('status', value as any)} value={data.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="canceled">Canceled</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                        </div>

                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                placeholder='notes'
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            />
                            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <Button variant="outline" asChild>
                                <Link href={route('appointments.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
