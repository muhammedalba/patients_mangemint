import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';

export default function DiscountForm({ patientId }: { patientId: number }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        discount_amount: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(data.discount_amount) < 0) {
            return alert('قيمة الخصم يجب أن تكون صفر أو أكبر');
        }

        post(route('patients.addDiscount', patientId), {
            onSuccess: () => {
                setSubmitted(true);
                reset();
                close();
            },
        });
    };

    if (submitted) {
        return (
            <div className="rounded-md border border-green-200 bg-green-50 p-6 text-green-700">
                ✅ تم إضافة الخصم بنجاح
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md rounded-lg bg-white p-6 shadow-md mt-2"
        >
            <FormInput
                label="قيمة الخصم"
                name="discount_amount"
                type="number"
                min="0"
                value={data.discount_amount}
                onChange={(val) => setData('discount_amount', val)}
                placeholder="أدخل قيمة الخصم"
                error={errors.discount_amount}
            />

            <div className="mt-6 flex gap-4">
                <FormButton
                    processing={processing}
                    label="إضافة الخصم"
                    loadingLabel="جارِ إضافة الخصم ..."
                />
            </div>
        </form>
    );
}
