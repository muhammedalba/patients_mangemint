import { Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

export default function ProcedureForm({
    services_category = [],
    patients = [],
    filteredTeeth = [],
    selectedTreatment,
    selectedTooth,
    onSuccess,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        cost: '',
        category: '',
        patient_id: '',
        tooth_id: '',
    });

    // عند تغيير السن المختار، اربطه بمعرّف السن من قاعدة البيانات
    useEffect(() => {
        if (selectedTooth && Array.isArray(filteredTeeth)) {
            const match = filteredTeeth.find(
                (t) => String(t.tooth_number) === String(selectedTooth),
            );
            if (match?.id) {
                setData('tooth_id', match.id.toString());
            }
        }
    }, [selectedTooth, filteredTeeth]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('procedures.store'), {
            onSuccess: () => {
                if (onSuccess) {
                    // مرر البيانات المحفوظة للـ DentalChart
                    onSuccess({ ...data });
                }
                reset();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* اختيار الخدمة */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {Array.isArray(services_category) &&
                    services_category.map((category) => (
                        <FormSelect
                            key={category.id}
                            label={`اختر خدمة من ${category.name}`}
                            name={`service_${category.id}`}
                            value={data.category}
                            onChange={(val) => setData('category', val)}
                            options={category.services.map((service) => ({
                                value: service.id.toString(),
                                label: service.name,
                            }))}
                            error={errors.category}
                        />
                    ))}
            </div>

            {/* بيانات الإجراء */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput
                    label="اسم الإجراء"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="الاسم الإجراء"
                    error={errors.name}
                />

                {selectedTreatment && (
                    <FormInput
                        label="المعالجة المختارة"
                        name="treatment_name"
                        value={selectedTreatment.name}
                        readOnly
                    />
                )}

                <FormInput
                    label="كلفة الإجراء"
                    name="cost"
                    value={data.cost}
                    onChange={(e) => setData('cost', e.target.value)}
                    placeholder="كلفة الإجراء"
                    error={errors.cost}
                />
            </div>

            {/* الوصف */}
            <div>
                <label
                    htmlFor="description"
                    className="block text-right text-gray-700"
                >
                    الوصف
                </label>
                <textarea
                    name="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="وصف الإجراء"
                    className="w-full rounded-lg border px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.description}
                    </p>
                )}
            </div>

            {/* المريض والسن */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* اختيار المريض بالـ id */}
                {/* <FormSelect
                    label="اسم المريض"
                    name="patient_id"
                    value={data.patient_id}
                    onChange={(val) => setData('patient_id', val)}
                    options={
                        Array.isArray(patients) && patients.length > 0
                            ? patients.map((p) => ({
                                  value: p.id.toString(),
                                  label: p.name,
                              }))
                            : [{ value: '', label: 'لا يوجد مرضى' }]
                    }
                    error={errors.patient_id}
                /> */}

                {/* عرض رقم السن المختار (FDI) للقراءة فقط */}
                <FormInput
                    label="رقم السن (FDI)"
                    name="tooth_number"
                    value={selectedTooth ? selectedTooth.toString() : ''}
                    readOnly
                />
            </div>

            {/* الأزرار */}
            <div className="flex items-center justify-end space-x-2">
                <Link
                    href={route('procedures.index')}
                    className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-300"
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
    );
}
