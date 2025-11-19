import { FormButton } from '@/components/FormButton';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MedicalRecord, Patient, User } from '@/types';
import { Tab } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { route } from 'ziggy-js';

interface Props {
    patients: Patient[];
    doctors: User[];
    initialData?: Partial<MedicalRecord>;
    submitLabel?: string;
}

export default function MedicalRecordForm({
    patients,
    doctors,
    initialData = {},
    submitLabel = 'Save',
}: Props) {
    // patients = Object.entries(patients).map(([id, name]) => ({
    //     id: id,
    //     name: name,
    // }));
    const { data, setData, post, put, errors, processing } = useForm({
        patient_id: initialData.patient_id || '',
        doctor_id: initialData.doctor_id || '',
        attachments: initialData.attachments || [],
        chief_complaint: initialData.chief_complaint || '',
        present_illness_history: initialData.present_illness_history || '',
        past_dental_history: initialData.past_dental_history || '',
        has_cardiovascular_disease:
            initialData.has_cardiovascular_disease || false,
        has_hypertension: initialData.has_hypertension || false,
        has_respiratory_disease: initialData.has_respiratory_disease || false,
        has_gastrointestinal_disease:
            initialData.has_gastrointestinal_disease || false,
        has_neural_disease: initialData.has_neural_disease || false,
        has_hepatic_disease: initialData.has_hepatic_disease || false,
        has_renal_disease: initialData.has_renal_disease || false,
        has_endocrine_disease: initialData.has_endocrine_disease || false,
        has_diabetes: initialData.has_diabetes || false,
        medical_disease_details: initialData.medical_disease_details || '',
        allergic_to: initialData.allergic_to || '',
        current_medications: initialData.current_medications || '',
        hospitalized_or_operated: initialData.hospitalized_or_operated || false,
        hospital_details: initialData.hospital_details || '',
        abnormal_bleeding_history:
            initialData.abnormal_bleeding_history || false,
        is_pregnant: initialData.is_pregnant || false,
        pregnancy_trimester: initialData.pregnancy_trimester || '',
        clinical_notes: initialData.clinical_notes || '',
    });
    console.log(errors, 'errors');
    console.log(patients, 'patients');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (initialData.id) {
            put(route('medical-records.update', initialData.id));
        } else {
            post(route('medical-records.store'));
        }
    }

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
    ];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'السجلات الطبية', href: route('medical-records.index') },
        { title: 'إضافة سجل طبي ', href: route('medical-records.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Medical record" />
            <div className="mx-auto mt-4 w-5xl rounded-xl border border-gray-100 bg-white p-4 px-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    إضافة سجل طبي جديد
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white p-6 shadow"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <FormSelect
                            label=" اسم المريض"
                            name="patient_id"
                            value={data.patient_id.toString()}
                            onChange={(e) => setData('patient_id', e)}
                            options={
                                patients.length > 0
                                    ? patients.map((p) => ({
                                          value: p.id.toString(),
                                          label: p.name,
                                      }))
                                    : [{ value: '', label: 'لا يوجد مرضى' }]
                            }
                            error={errors.patient_id}
                        />

                        <FormSelect
                            label="  اسم الطبيب"
                            name="doctor_id"
                            value={data.doctor_id.toString()}
                            onChange={(e) => setData('doctor_id', e)}
                            options={
                                doctors.length > 0
                                    ? doctors.map((p) => ({
                                          value: p.id.toString(),
                                          label: p.name,
                                      }))
                                    : [{ value: '', label: 'لا يوجد طبيب' }]
                            }
                            error={errors.doctor_id}
                        />
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
                                        const isBoolean =
                                            typeof value === 'boolean';

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
                                                                key,
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="h-5 w-5"
                                                    />
                                                ) : key ===
                                                  'pregnancy_trimester' ? (
                                                    <select
                                                        value={value}
                                                        onChange={(e) =>
                                                            setData(
                                                                key,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded border p-2 md:w-3/4"
                                                    >
                                                        <option value="">
                                                            Select Trimester
                                                        </option>
                                                        <option value="I">
                                                            I
                                                        </option>
                                                        <option value="II">
                                                            II
                                                        </option>
                                                        <option value="III">
                                                            III
                                                        </option>
                                                    </select>
                                                ) : key === 'attachments' ? (
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={(e) =>
                                                            setData(
                                                                key,
                                                                Array.from(
                                                                    e.target
                                                                        .files ||
                                                                        [],
                                                                ),
                                                            )
                                                        }
                                                        className="w-full rounded border p-2 md:w-3/4"
                                                    />
                                                ) : (
                                                    <textarea
                                                        value={value}
                                                        onChange={(e) =>
                                                            setData(
                                                                key,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded border p-2 md:w-3/4"
                                                    />
                                                )}
                                                {errors[key] && (
                                                    <div className="text-red-500 md:w-3/4">
                                                        {errors[key]}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>

                    <div className="flex items-center justify-end space-x-2">
                        <Link
                            href={route('medical-records.index')}
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
