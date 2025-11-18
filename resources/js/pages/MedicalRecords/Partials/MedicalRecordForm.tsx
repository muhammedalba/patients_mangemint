import InputError from '@/components/input-error';
import { MedicalRecord, Patient, User } from '@/types';
import { Tab } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import { route } from 'ziggy-js';

interface Props {
    patients: Patient[];
    doctors: User[];
    medicalRecord?: MedicalRecord;
    submitLabel?: string;
}

export default function MedicalRecordForm({
    patients,
    doctors,
    medicalRecord,
    submitLabel = 'Save',
}: Props) {
    const { data, setData, post, errors, processing } = useForm({
        _method: medicalRecord ? 'PUT' : 'POST',
        patient_id: medicalRecord?.patient_id || '',
        doctor_id: medicalRecord?.doctor_id || '',
        attachments: [],
        images: [],
        deleted_attachments: [],
        deleted_images: [],
        chief_complaint: medicalRecord?.chief_complaint || '',
        present_illness_history: medicalRecord?.present_illness_history || '',
        past_dental_history: medicalRecord?.past_dental_history || '',
        has_cardiovascular_disease:
            medicalRecord?.has_cardiovascular_disease || false,
        has_hypertension: medicalRecord?.has_hypertension || false,
        has_respiratory_disease:
            medicalRecord?.has_respiratory_disease || false,
        has_gastrointestinal_disease:
            medicalRecord?.has_gastrointestinal_disease || false,
        has_neural_disease: medicalRecord?.has_neural_disease || false,
        has_hepatic_disease: medicalRecord?.has_hepatic_disease || false,
        has_renal_disease: medicalRecord?.has_renal_disease || false,
        has_endocrine_disease: medicalRecord?.has_endocrine_disease || false,
        has_diabetes: medicalRecord?.has_diabetes || false,
        medical_disease_details: medicalRecord?.medical_disease_details || '',
        allergic_to: medicalRecord?.allergic_to || '',
        current_medications: medicalRecord?.current_medications || '',
        hospitalized_or_operated:
            medicalRecord?.hospitalized_or_operated || false,
        hospital_details: medicalRecord?.hospital_details || '',
        abnormal_bleeding_history:
            medicalRecord?.abnormal_bleeding_history || false,
        is_pregnant: medicalRecord?.is_pregnant || false,
        pregnancy_trimester: medicalRecord?.pregnancy_trimester || '',
        clinical_notes: medicalRecord?.clinical_notes || '',
    });

    console.log(errors, 'errors');
    const [existingAttachments, setExistingAttachments] = useState(
        medicalRecord?.attachments || [],
    );
    const [existingImages, setExistingImages] = useState(
        medicalRecord?.images || [],
    );
    console.log(medicalRecord, 'medicalRecord');

    function handleSubmit(e: React.FormEvent) {
        console.log(data, 'data');

        e.preventDefault();
        const url = medicalRecord
            ? route('medical-records.update', medicalRecord.id)
            : route('medical-records.store');
        post(url, {
            forceFormData: true,
        });
    }

    const handleDeleteAttachment = (attachment: string) => {
        setData('deleted_attachments', [
            ...data.deleted_attachments,
            attachment,
        ]);
        setExistingAttachments((prev) =>
            prev.filter((att) => att !== attachment),
        );
    };

    const handleDeleteImage = (image: string) => {
        // setData('deleted_images', (prev) => [...prev, image]);
        setData('deleted_images', [...data.deleted_images, image]);
        setExistingImages((prev) => prev.filter((img) => img !== image));
    };

    const tabs = [
        {
            name: 'Dental History',
            keys: [
                'chief_complaint',
                'present_illness_history',
                'past_dental_history',
            ],
        },
        {
            name: 'Medical Conditions',
            keys: [
                'has_cardiovascular_disease',
                'has_hypertension',
                'has_respiratory_disease',
                'has_gastrointestinal_disease',
                'has_neural_disease',
                'has_hepatic_disease',
                'has_renal_disease',
                'has_endocrine_disease',
                'has_diabetes',
                'medical_disease_details',
            ],
        },
        {
            name: 'Medications & Allergies',
            keys: ['allergic_to', 'current_medications'],
        },
        {
            name: 'Special Cases',
            keys: [
                'hospitalized_or_operated',
                'hospital_details',
                'abnormal_bleeding_history',
                'is_pregnant',
                'pregnancy_trimester',
                'clinical_notes',
            ],
        },
        {
            name: 'Media',
            keys: ['attachments', 'images'],
        },
    ];

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white p-6 shadow"
        >
            {/* Patient Select */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <label className="font-medium md:w-1/4">Patient</label>
                <select
                    value={data.patient_id}
                    onChange={(e) => setData('patient_id', e.target.value)}
                    className="w-full rounded border p-2 md:w-3/4"
                    disabled={!!medicalRecord}
                >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.patient_id} />
            </div>

            {/* Doctor Select */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <label className="font-medium md:w-1/4">Doctor</label>
                <select
                    value={data.doctor_id || ''}
                    onChange={(e) => setData('doctor_id', e.target.value)}
                    className="w-full rounded border p-2 md:w-3/4"
                >
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.doctor_id} />
            </div>

            {/* Tabs for other fields */}
            <Tab.Group>
                <Tab.List className="mb-4 flex space-x-2 overflow-x-auto border-b">
                    {tabs.map((tab) => (
                        <Tab as={Fragment} key={tab.name}>
                            {({ selected }) => (
                                <button
                                    className={`rounded-t-lg px-4 py-2 font-medium ${
                                        selected
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                    type="button"
                                >
                                    {tab.name}
                                </button>
                            )}
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels>
                    {tabs.map((tab) => (
                        <Tab.Panel key={tab.name} className="space-y-4">
                            {tab.keys.map((key) => {
                                const value = (data as any)[key];
                                const isBoolean = typeof value === 'boolean';

                                if (key === 'attachments' || key === 'images') {
                                    const existingFiles =
                                        key === 'attachments'
                                            ? existingAttachments
                                            : existingImages;
                                    const handleDelete =
                                        key === 'attachments'
                                            ? handleDeleteAttachment
                                            : handleDeleteImage;
                                    return (
                                        <div key={key}>
                                            <label className="font-medium capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) =>
                                                    setData(
                                                        key as any,
                                                        Array.from(
                                                            e.target.files ||
                                                                [],
                                                        ) as never[],
                                                    )
                                                }
                                                className="w-full rounded border p-2"
                                            />
                                            {existingFiles.length > 0 && (
                                                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                                    {existingFiles.map(
                                                        (file) => (
                                                            <div
                                                                key={file}
                                                                className="relative"
                                                            >
                                                                {key ===
                                                                'images' ? (
                                                                    <img
                                                                        src={`/storage/${file}`}
                                                                        className="h-24 w-full rounded object-cover"
                                                                    />
                                                                ) : (
                                                                    <a
                                                                        href={`/storage/${file}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block truncate rounded bg-gray-200 p-2 text-center"
                                                                    >
                                                                        {file
                                                                            .split(
                                                                                '/',
                                                                            )
                                                                            .pop()}
                                                                    </a>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            file,
                                                                        )
                                                                    }
                                                                    className="absolute top-0 right-0 rounded-full bg-red-500 p-1 text-white"
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={key}
                                        className="flex flex-col md:flex-row md:items-center md:space-x-4"
                                    >
                                        <label className="font-medium capitalize md:w-1/4">
                                            {key.replace(/_/g, ' ')}
                                        </label>
                                        {isBoolean ? (
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) =>
                                                    setData(
                                                        key as any,
                                                        e.target.checked,
                                                    )
                                                }
                                                className="h-5 w-5"
                                            />
                                        ) : key === 'pregnancy_trimester' ? (
                                            <select
                                                value={value as string}
                                                onChange={(e) =>
                                                    setData(
                                                        key as any,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border p-2 md:w-3/4"
                                            >
                                                <option value="">
                                                    Select Trimester
                                                </option>
                                                <option value="I">I</option>
                                                <option value="II">II</option>
                                                <option value="III">III</option>
                                            </select>
                                        ) : (
                                            <textarea
                                                value={value as string}
                                                onChange={(e) =>
                                                    setData(
                                                        key as any,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border p-2 md:w-3/4"
                                            />
                                        )}
                                        {errors[key as keyof typeof errors] && (
                                            <div className="text-red-500 md:w-3/4">
                                                {
                                                    errors[
                                                        key as keyof typeof errors
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>

            <div className="text-right">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
