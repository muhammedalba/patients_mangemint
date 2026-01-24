import { FormSelect } from '@/components/FormSelect';
import { SearchInput } from '@/components/SearchInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MedicalRecord, Patient, User } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useForm, router } from '@inertiajs/react';
import { Stethoscope, User as UserIcon } from 'lucide-react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import { DentalHistoryTab } from './DentalHistoryTab';
import { FilesTab } from './FilesTab';
import { FormFooter } from './FormFooter';
import { GeneralHealthTab } from './GeneralHealthTab';
import { MedicationsTab } from './MedicationsTab';
import { tabs } from './MedicalRecordFormConfig';


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
    submitLabel = 'حفظ السجل',
}: Props) {
    const { data, setData, post, errors, processing } = useForm({
        _method: medicalRecord ? 'PUT' : 'POST',
        patient_id: medicalRecord?.patient_id || '',
        doctor_id: medicalRecord?.doctor_id || '',
        attachments: medicalRecord?.attachments || [],
        images: medicalRecord?.images || [],
        deleted_attachments: medicalRecord?.deleted_attachments || [],
        deleted_images: medicalRecord?.deleted_images || [],
        chief_complaint: medicalRecord?.chief_complaint || [],
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

    const [existingAttachments, setExistingAttachments] = useState<any[]>(
        medicalRecord?.attachments || [],
    );
    const [existingImages, setExistingImages] = useState<any[]>(
        medicalRecord?.images || [],
    );
    const [selectedPatientName, setSelectedPatientName] = useState('');

    const imagesErrors = Object.entries(errors)
        .filter(([key]) => key.startsWith('images.'))
        .map(([, value]) => value);
    const attachmentsErrors = Object.entries(errors)
        .filter(([key]) => key.startsWith('attachments.'))
        .map(([, value]) => value);

    const handlePatientSelect = useCallback(
        (patient: Patient) => {
            setSelectedPatientName(patient.name);
            setData('patient_id', patient.id.toString());
        },
        [setData],
    );

    useEffect(() => {
        if (medicalRecord && patients.length > 0) {
            const patient = patients.find(
                (p) => p.id === medicalRecord.patient_id,
            );
            setData('patient_id', medicalRecord.patient_id.toString());
            setSelectedPatientName(patient?.name || '');
        }
        if (!medicalRecord && patients.length === 1) {
            setData('patient_id', patients[0].id.toString());
            setSelectedPatientName(patients[0]?.name || '');
        }
    }, [patients, medicalRecord, setData]);

    const { success, error } = useAppToast();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const url = medicalRecord
            ? route('medical-records.update', medicalRecord.id)
            : route('medical-records.store');

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                success(
                    medicalRecord
                        ? 'تم تحديث السجل الطبي بنجاح'
                        : 'تم إنشاء السجل الطبي بنجاح',
                );
            },
            onError: () => {
                error('فشل حفظ السجل الطبي', 'يرجى التحقق من البيانات المدخلة');
            },
        });
    }

    const handleDeleteAttachment = (attachment: any) => {
        if (medicalRecord) {
            router.delete(route('medical-records.delete-file', medicalRecord.id), {
                data: { path: attachment, type: 'attachments' },
                preserveScroll: true,
                onSuccess: () => {
                    setExistingAttachments((prev) =>
                        prev.filter((att) => att !== attachment),
                    );
                },
            });
        } else {
            setData('deleted_attachments', [
                ...data.deleted_attachments,
                attachment,
            ]);
            setExistingAttachments((prev) =>
                prev.filter((att) => att !== attachment),
            );
        }
    };

    const handleDeleteImage = (image: any) => {
        if (medicalRecord) {
            router.delete(route('medical-records.delete-file', medicalRecord.id), {
                data: { path: image, type: 'images' },
                preserveScroll: true,
                onSuccess: () => {
                    setExistingImages((prev) =>
                        prev.filter((img) => img !== image),
                    );
                },
            });
        } else {
            setData('deleted_images', [...data.deleted_images, image]);
            setExistingImages((prev) => prev.filter((img) => img !== image));
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-6xl gap-6 font-sans"
        >
            <Card className="mb-6 border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                        <UserIcon className="h-5 w-5 text-teal-600" />
                        بيانات الملف الأساسية
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SearchInput
                            label="ابحث عن المريض..."
                            name="patient_id"
                            icon={UserIcon}
                            value={selectedPatientName}
                            onChange={setSelectedPatientName}
                            options={patients}
                            onSelect={handlePatientSelect}
                            error={errors.patient_id}
                        />
                        <FormSelect
                            label="اسم الطبيب"
                            name="doctor_id"
                            icon={Stethoscope}
                            value={String(data.doctor_id ?? '')}
                            onChange={(val) =>
                                setData('doctor_id', val.toString())
                            }
                            options={doctors.map((doctor) => ({
                                key: doctor.id.toString(),
                                value: doctor.id.toString(),
                                label: doctor.name,
                            }))}
                            error={errors.doctor_id}
                        />
                    </div>
                </CardContent>
            </Card>

            <TabGroup>
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <TabList className="flex w-full shrink-0 flex-row gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 md:w-64 md:flex-col">
                        {tabs.map((tab) => (
                            <Tab as={Fragment} key={tab.name}>
                                {({ selected }) => (
                                    <button
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all outline-none',
                                            selected
                                                ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                                        )}
                                    >
                                        <tab.icon
                                            className={cn(
                                                'h-5 w-5',
                                                selected
                                                    ? 'text-teal-600'
                                                    : 'text-slate-400',
                                            )}
                                        />
                                        <span className="whitespace-nowrap">
                                            {tab.name}
                                        </span>
                                        {selected && (
                                            <div className="mr-auto hidden h-2 w-2 rounded-full bg-teal-500 md:block" />
                                        )}
                                    </button>
                                )}
                            </Tab>
                        ))}
                    </TabList>

                    <TabPanels className="flex-1">
                        <TabPanel className="space-y-6 focus:outline-none">
                            <DentalHistoryTab
                                data={data}
                                setData={setData as any}
                                errors={errors as any}
                            />
                        </TabPanel>

                        <TabPanel className="space-y-6 focus:outline-none">
                            <GeneralHealthTab
                                data={data}
                                setData={setData as any}
                                errors={errors as any}
                            />
                        </TabPanel>

                        <TabPanel className="space-y-6 focus:outline-none">
                            <MedicationsTab
                                data={data}
                                setData={setData as any}
                                errors={errors as any}
                            />
                        </TabPanel>

                        <TabPanel className="space-y-6 focus:outline-none">
                            <FilesTab
                                data={data}
                                setData={setData as any}
                                existingImages={existingImages}
                                existingAttachments={existingAttachments}
                                onDeleteImage={handleDeleteImage}
                                onDeleteAttachment={handleDeleteAttachment}
                                imagesErrors={imagesErrors}
                                attachmentsErrors={attachmentsErrors}
                                isEdit={!!medicalRecord}
                            />
                        </TabPanel>
                    </TabPanels>
                </div>
            </TabGroup>

            <FormFooter
                processing={processing}
                submitLabel={submitLabel}
            />
        </form>
    );
}
