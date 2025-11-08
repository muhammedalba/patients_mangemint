import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MedicalRecord, PageProps, Patient, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Edit({
    medicalRecord,
    patients,
    doctors,
}: PageProps<{ medicalRecord: MedicalRecord; patients: Patient[]; doctors: User[] }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Medical Records', href: route('medical-records.index') },
        { title: `Record #${medicalRecord.id}`, href: route('medical-records.show', medicalRecord.id) },
        { title: 'Edit', href: route('medical-records.edit', medicalRecord.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        patient_id: medicalRecord.patient_id || '',
        doctor_id: medicalRecord.doctor_id || '',
        attachments: medicalRecord.attachments || [],
        chief_complaint: medicalRecord.chief_complaint || '',
        present_illness_history: medicalRecord.present_illness_history || '',
        past_dental_history: medicalRecord.past_dental_history || '',
        has_cardiovascular_disease: medicalRecord.has_cardiovascular_disease || false,
        has_hypertension: medicalRecord.has_hypertension || false,
        has_respiratory_disease: medicalRecord.has_respiratory_disease || false,
        has_gastrointestinal_disease: medicalRecord.has_gastrointestinal_disease || false,
        has_neural_disease: medicalRecord.has_neural_disease || false,
        has_hepatic_disease: medicalRecord.has_hepatic_disease || false,
        has_renal_disease: medicalRecord.has_renal_disease || false,
        has_endocrine_disease: medicalRecord.has_endocrine_disease || false,
        has_diabetes: medicalRecord.has_diabetes || false,
        medical_disease_details: medicalRecord.medical_disease_details || '',
        allergic_to: medicalRecord.allergic_to || '',
        current_medications: medicalRecord.current_medications || '',
        hospitalized_or_operated: medicalRecord.hospitalized_or_operated || false,
        hospital_details: medicalRecord.hospital_details || '',
        abnormal_bleeding_history: medicalRecord.abnormal_bleeding_history || false,
        is_pregnant: medicalRecord.is_pregnant || false,
        pregnancy_trimester: medicalRecord.pregnancy_trimester || '',
        clinical_notes: medicalRecord.clinical_notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('medical-records.update', medicalRecord.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Medical Record #${medicalRecord.id}`} />

            <section className="max-w-5xl mx-auto p-6 sm:p-8 md:p-10">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-800">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                تعديل السجل الطبي
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                يمكنك تعديل بيانات السجل الطبي كاملة هنا.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                        {/* --- Patient & Doctor --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    المريض
                                </label>
                                <select
                                    value={data.patient_id}
                                    onChange={e => setData('patient_id', e.target.value)}
                                    className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="">اختر المريض</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    الطبيب
                                </label>
                                <select
                                    value={data.doctor_id}
                                    onChange={e => setData('doctor_id', e.target.value)}
                                    className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="">اختر الطبيب</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* --- Chief Complaint --- */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                الشكوى الرئيسية
                            </label>
                            <textarea
                                value={data.chief_complaint}
                                onChange={e => setData('chief_complaint', e.target.value)}
                                className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                rows={2}
                            />
                        </div>

                        {/* --- Medical History --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea
                                placeholder="تاريخ المرض الحالي"
                                value={data.present_illness_history}
                                onChange={e => setData('present_illness_history', e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                rows={3}
                            />
                            <textarea
                                placeholder="التاريخ السني السابق"
                                value={data.past_dental_history}
                                onChange={e => setData('past_dental_history', e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                rows={3}
                            />
                        </div>

                        {/* --- Diseases --- */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">الأمراض</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {[
                                    ['has_cardiovascular_disease', 'أمراض القلب والأوعية'],
                                    ['has_hypertension', 'ارتفاع ضغط الدم'],
                                    ['has_respiratory_disease', 'أمراض الجهاز التنفسي'],
                                    ['has_gastrointestinal_disease', 'أمراض الجهاز الهضمي'],
                                    ['has_neural_disease', 'أمراض الجهاز العصبي'],
                                    ['has_hepatic_disease', 'أمراض الكبد'],
                                    ['has_renal_disease', 'أمراض الكلى'],
                                    ['has_endocrine_disease', 'أمراض الغدد الصماء'],
                                    ['has_diabetes', 'السكري'],
                                ].map(([key, label]) => (
                                    <label key={key} className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <input
                                            type="checkbox"
                                            checked={data[key as keyof typeof data] as boolean}
                                            onChange={e => setData(key as keyof typeof data, e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* --- Details --- */}
                        <textarea
                            placeholder="تفاصيل الأمراض الطبية"
                            value={data.medical_disease_details}
                            onChange={e => setData('medical_disease_details', e.target.value)}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            rows={3}
                        />

                        {/* --- Allergies and Medications --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="الحساسية تجاه"
                                value={data.allergic_to}
                                onChange={e => setData('allergic_to', e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            />
                            <textarea
                                placeholder="الأدوية الحالية"
                                value={data.current_medications}
                                onChange={e => setData('current_medications', e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                rows={2}
                            />
                        </div>

                        {/* --- Other Conditions --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2 rtl:space-x-reverse">
                                <input
                                    type="checkbox"
                                    checked={data.hospitalized_or_operated}
                                    onChange={e => setData('hospitalized_or_operated', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    هل تم إدخاله المستشفى / عملية جراحية
                                </span>
                            </label>

                            <input
                                type="text"
                                placeholder="تفاصيل المستشفى أو العملية"
                                value={data.hospital_details}
                                onChange={e => setData('hospital_details', e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="flex items-center space-x-2 rtl:space-x-reverse">
                                <input
                                    type="checkbox"
                                    checked={data.abnormal_bleeding_history}
                                    onChange={e => setData('abnormal_bleeding_history', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">نزيف غير طبيعي</span>
                            </label>

                            <label className="flex items-center space-x-2 rtl:space-x-reverse">
                                <input
                                    type="checkbox"
                                    checked={data.is_pregnant}
                                    onChange={e => setData('is_pregnant', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">حامل</span>
                            </label>

                            <select
                                value={data.pregnancy_trimester}
                                onChange={e => setData('pregnancy_trimester', e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="">اختر فترة الحمل</option>
                                <option value="I">الثلث الأول</option>
                                <option value="II">الثلث الثاني</option>
                                <option value="III">الثلث الثالث</option>
                            </select>
                        </div>

                        {/* --- Clinical Notes --- */}
                        <textarea
                            placeholder="ملاحظات سريرية إضافية"
                            value={data.clinical_notes}
                            onChange={e => setData('clinical_notes', e.target.value)}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            rows={3}
                        />

                        {/* --- Submit Button --- */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {processing ? '...جارٍ الحفظ' : 'تحديث السجل'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </AppLayout>
    );
}
