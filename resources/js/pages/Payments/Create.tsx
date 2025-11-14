import { AppShell } from '@/components/app-shell';
import { BreadcrumbItem, PageProps, Patient } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

interface CreateProps extends PageProps {
    patients: Patient[];
}

const Create: React.FC<CreateProps> = ({ auth, patients }) => {
    const { data, setData, post, errors, processing } = useForm({
        patient_id: '',
        amount: '',
        payment_date: '',
        paid_at: '',
        notes: '',
    });
    console.log(errors, 'errors');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(data , 'data ');

        post(route('payments.store'));
    }
 const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Payments',
            href: route('payments.index'),
        },
        {
            title: 'Add Payment',
            href: route('payments.create'),
        }
    ];
    return (
         <AppLayout breadcrumbs={breadcrumbs}>

            <AppShell user={auth.user}>
            <Head title="Add Payment" />
            <div className="p-4">

                <Heading title="Add Payment" />

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 max-w-xl space-y-4"
                >
                    <div>
                        <Label htmlFor="patient_id">Patient</Label>
                        <Select
                            onValueChange={(value) =>
                                setData('patient_id', value)
                            }
                            defaultValue={data.patient_id}
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
                        <InputError
                            message={errors.patient_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.amount} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="payment_date">Payment Date</Label>
                        <Input
                            id="payment_date"
                            type="date"
                            value={data.payment_date}
                            onChange={(e) =>
                                setData('payment_date', e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.payment_date}
                            className="mt-2"
                        />
                    </div>

                    {/* <div>
                        <Label htmlFor="paid_at">Paid At</Label>
                        <Input
                            id="paid_at"
                            type="date"
                            value={data.paid_at}
                            onChange={(e) => setData('paid_at', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.paid_at} className="mt-2" />
                    </div> */}

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            type="text"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Add Payment</Button>
                    </div>
                </form>
            </div>
        </AppShell>
         </AppLayout>

    );
};

export default Create;
