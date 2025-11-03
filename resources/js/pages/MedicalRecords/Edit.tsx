import LoadingPage from '@/components/LoadingPage';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MedicalRecord, Patient, User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

interface MedicalRecordFormData {
    patient_id: number | string;
    doctor_id: number | string;
    details: string;
    date: string;
    attachments?: string;
}

export default function EditMedicalRecord({ record }: { record: MedicalRecord }) {
    const { patients, doctors } = usePage<{ patients: Patient[]; doctors: User[] }>().props;
console.log(record,"record");
console.log(patients,"patients");
console.log(doctors,"doctors");


    const { data, setData, post, processing, errors } = useForm<MedicalRecordFormData>({
        patient_id: record.patient_id || '',
        doctor_id: record.doctor_id || '',
        details: record.details || '',
        date: record.date || '',
        attachments: record.attachments || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            post(route('medicalrecords.update', record.id));
        }
        catch(error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'السجلات الطبية', href: route('medicalrecords.index') },
        { title: `تعديل سجل طبي: ${record?.id}`, href: route('medicalrecords.edit', record?.id) },
    ];

    if (isLoading) return <LoadingPage />;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل سجل طبي: ${record.id}`} />
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    تعديل سجل طبي
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="patient_id" className="mb-2 block text-gray-700">المريض</label>
                        <select
                            id="patient_id"
                            name="patient_id"
                            value={data.patient_id}
                            onChange={(e) => setData('patient_id', parseInt(e.target.value))}
                            className="w-full rounded-lg border bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">اختر المريض</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                        {errors.patient_id && <p className="mt-1 text-sm text-red-500">{errors.patient_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="doctor_id" className="mb-2 block text-gray-700">الطبيب</label>
                        <select
                            id="doctor_id"
                            name="doctor_id"
                            value={data.doctor_id}
                            onChange={(e) => setData('doctor_id', parseInt(e.target.value))}
                            className="w-full rounded-lg border bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">اختر الطبيب</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                        {errors.doctor_id && <p className="mt-1 text-sm text-red-500">{errors.doctor_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="date" className="mb-2 block text-gray-700">التاريخ</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                    </div>

                    <div>
                        <label htmlFor="details" className="mb-2 block text-gray-700">التفاصيل</label>
                        <textarea
                            id="details"
                            name="details"
                            value={data.details}
                            onChange={(e) => setData('details', e.target.value)}
                            placeholder="التفاصيل"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={5}
                        ></textarea>
                        {errors.details && <p className="mt-1 text-sm text-red-500">{errors.details}</p>}
                    </div>

                    <div>
                        <label htmlFor="attachments" className="mb-2 block text-gray-700">المرفقات</label>
                        <input
                            id="attachments"
                            type="text"
                            name="attachments"
                            value={data.attachments}
                            onChange={(e) => setData('attachments', e.target.value)}
                            placeholder="المرفقات (رابط أو اسم ملف)"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.attachments && <p className="mt-1 text-sm text-red-500">{errors.attachments}</p>}
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-200 ${
                                processing
                                    ? 'cursor-not-allowed bg-blue-400'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {processing ? 'جارٍ التحديث...' : 'تحديث السجل الطبي'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
