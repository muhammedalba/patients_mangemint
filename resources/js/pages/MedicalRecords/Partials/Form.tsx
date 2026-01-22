import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { MedicalRecord, Patient, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { route } from 'ziggy-js';

interface MedicalRecordFormProps {
    medicalRecord?: MedicalRecord;
    patients: Patient[];
    doctors: User[];
    submitLabel: string;
}

export default function MedicalRecordForm({ medicalRecord, patients, doctors, submitLabel }: MedicalRecordFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        patient_id: medicalRecord?.patient_id || '',
        doctor_id: medicalRecord?.doctor_id || '',
        chief_complaint: medicalRecord?.chief_complaint || '',
        present_illness_history: medicalRecord?.present_illness_history || '',
        past_dental_history: medicalRecord?.past_dental_history || '',
        has_cardiovascular_disease: medicalRecord?.has_cardiovascular_disease || false,
        has_hypertension: medicalRecord?.has_hypertension || false,
        has_respiratory_disease: medicalRecord?.has_respiratory_disease || false,
        has_gastrointestinal_disease: medicalRecord?.has_gastrointestinal_disease || false,
        has_neural_disease: medicalRecord?.has_neural_disease || false,
        has_hepatic_disease: medicalRecord?.has_hepatic_disease || false,
        has_renal_disease: medicalRecord?.has_renal_disease || false,
        has_endocrine_disease: medicalRecord?.has_endocrine_disease || false,
        has_diabetes: medicalRecord?.has_diabetes || false,
        medical_disease_details: medicalRecord?.medical_disease_details || '',
        allergic_to: medicalRecord?.allergic_to || '',
        current_medications: medicalRecord?.current_medications || '',
        hospitalized_or_operated: medicalRecord?.hospitalized_or_operated || false,
        hospital_details: medicalRecord?.hospital_details || '',
        abnormal_bleeding_history: medicalRecord?.abnormal_bleeding_history || false,
        is_pregnant: medicalRecord?.is_pregnant || false,
        pregnancy_trimester: medicalRecord?.pregnancy_trimester || '',
        clinical_notes: medicalRecord?.clinical_notes || '',
    });
console.log(errors,'errors');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (medicalRecord) {
            put(route('medical-records.update', medicalRecord.id));
        } else {
            post(route('medical-records.store'));
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{submitLabel} Medical Record</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="patient_id">Patient</Label>
                            <Select
                                name="patient_id"
                                value={String(data.patient_id)}
                                onValueChange={(value) => setData('patient_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((patient) => (
                                        <SelectItem key={patient.id} value={String(patient.id)}>
                                            {patient.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.patient_id} className="mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="doctor_id">Doctor</Label>
                            <Select
                                name="doctor_id"
                                value={String(data.doctor_id)}
                                onValueChange={(value) => setData('doctor_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doctor) => (
                                        <SelectItem key={doctor.id} value={String(doctor.id)}>
                                            {doctor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.doctor_id} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="chief_complaint">Chief Complaint</Label>
                        <textarea
                            id="chief_complaint"
                            value={data.chief_complaint}
                            onChange={(e) => setData('chief_complaint', e.target.value)}
                        />
                        <InputError message={errors.chief_complaint} className="mt-2" />
                    </div>

                    {/* Add other form fields here based on the migration */}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="has_cardiovascular_disease"
                            checked={data.has_cardiovascular_disease}
                            onCheckedChange={(checked) => setData('has_cardiovascular_disease', !!checked)}
                        />
                         <InputError message={errors.has_cardiovascular_disease}/>
                        <Label htmlFor="has_cardiovascular_disease">Has Cardiovascular Disease</Label>
                    </div>

                    <div>
                        <Label htmlFor="clinical_notes">Clinical Notes</Label>
                        <textarea
                            id="clinical_notes"
                            value={data.clinical_notes}
                            onChange={(e) => setData('clinical_notes', e.target.value)}
                        />
                        <InputError message={errors.clinical_notes} className="mt-2" />
                    </div>


                    <Button disabled={processing}>{submitLabel}</Button>
                </form>
            </CardContent>
        </Card>
    );
}
