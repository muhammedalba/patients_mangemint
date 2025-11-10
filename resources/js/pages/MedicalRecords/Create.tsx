import { useForm } from '@inertiajs/react';
import { Patient, User, MedicalRecord } from '@/types';
import { route } from 'ziggy-js';
import { Fragment } from 'react';
import { Tab } from '@headlessui/react';

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
  const { data, setData, post, put, errors, processing } = useForm({
    patient_id: initialData.patient_id || '',
    doctor_id: initialData.doctor_id || '',
    attachments: initialData.attachments || [],
    chief_complaint: initialData.chief_complaint || '',
    present_illness_history: initialData.present_illness_history || '',
    past_dental_history: initialData.past_dental_history || '',
    has_cardiovascular_disease: initialData.has_cardiovascular_disease || false,
    has_hypertension: initialData.has_hypertension || false,
    has_respiratory_disease: initialData.has_respiratory_disease || false,
    has_gastrointestinal_disease: initialData.has_gastrointestinal_disease || false,
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
    abnormal_bleeding_history: initialData.abnormal_bleeding_history || false,
    is_pregnant: initialData.is_pregnant || false,
    pregnancy_trimester: initialData.pregnancy_trimester || '',
    clinical_notes: initialData.clinical_notes || '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (initialData.id) {
      put(route('medical-records.update', initialData.id));
    } else {
      post(route('medical-records.store'));
    }
  }

  const tabs = [
    { name: 'Dental History', keys: ['chief_complaint', 'present_illness_history', 'past_dental_history'] },
    { name: 'Medical Conditions', keys: [
      'has_cardiovascular_disease', 'has_hypertension', 'has_respiratory_disease',
      'has_gastrointestinal_disease', 'has_neural_disease', 'has_hepatic_disease',
      'has_renal_disease', 'has_endocrine_disease', 'has_diabetes', 'medical_disease_details'
    ]},
    { name: 'Medications & Allergies', keys: ['allergic_to', 'current_medications'] },
    { name: 'Special Cases', keys: ['hospitalized_or_operated', 'hospital_details', 'abnormal_bleeding_history', 'is_pregnant', 'pregnancy_trimester', 'clinical_notes'] },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6 max-w-4xl mx-auto">
      {/* Patient Select */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <label className="md:w-1/4 font-medium">Patient</label>
        <select
          value={data.patient_id}
          onChange={(e) => setData('patient_id', e.target.value)}
          className="border p-2 rounded w-full md:w-3/4"
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.patient_id && <div className="text-red-500 md:w-3/4">{errors.patient_id}</div>}
      </div>

      {/* Doctor Select */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <label className="md:w-1/4 font-medium">Doctor</label>
        <select
          value={data.doctor_id || ''}
          onChange={(e) => setData('doctor_id', e.target.value)}
          className="border p-2 rounded w-full md:w-3/4"
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        {errors.doctor_id && <div className="text-red-500 md:w-3/4">{errors.doctor_id}</div>}
      </div>

      {/* Tabs for other fields */}
      <Tab.Group>
        <Tab.List className="flex space-x-2 border-b mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Tab as={Fragment} key={tab.name}>
              {({ selected }) => (
                <button
                  className={`px-4 py-2 rounded-t-lg font-medium ${
                    selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
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

                return (
                  <div key={key} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <label className="md:w-1/4 font-medium capitalize">{key.replace(/_/g, ' ')}</label>
                    {isBoolean ? (
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setData(key, e.target.checked)}
                        className="h-5 w-5"
                      />
                    ) : key === 'pregnancy_trimester' ? (
                      <select
                        value={value}
                        onChange={(e) => setData(key, e.target.value)}
                        className="border p-2 rounded w-full md:w-3/4"
                      >
                        <option value="">Select Trimester</option>
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                      </select>
                    ) : key === 'attachments' ? (
                      <input
                        type="file"
                        multiple
                        onChange={(e) => setData(key, Array.from(e.target.files || []))}
                        className="border p-2 rounded w-full md:w-3/4"
                      />
                    ) : (
                      <textarea
                        value={value}
                        onChange={(e) => setData(key, e.target.value)}
                        className="border p-2 rounded w-full md:w-3/4"
                      />
                    )}
                    {errors[key] && <div className="text-red-500 md:w-3/4">{errors[key]}</div>}
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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
