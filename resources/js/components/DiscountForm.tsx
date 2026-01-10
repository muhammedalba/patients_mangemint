import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';

export default function DiscountForm({ patientId }: { patientId: number }) {
    const { data, setData, post, processing, errors } = useForm({
        discount_amount: '',
    });
    const [isVisible, setIsVisible] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(data.discount_amount) < 0) {
            alert('قيمة الخصم يجب أن تكون صفر أو أكبر');
            return;
        }

        post(route('patients.addDiscount', patientId), {
            onSuccess: () => {
                setIsVisible(false);
            },
        });
    };


    if (!isVisible) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit} className="p-10">
            <div className="w-1/2">
                <FormInput
                    label="قيمة الخصم"
                    name="discount_amount"
                    min="0"
                    value={data.discount_amount}
                    onChange={(val) => setData('discount_amount', val)}
                    placeholder=" قيمة الخصم"
                    error={errors.discount_amount}
                />

                <div className="flex gap-4 mt-4">
                    <FormButton
                        processing={processing}
                        label="إضافة الخصم"
                        loadingLabel="جارِ إضافة الخصم ..."
                    />
                </div>
            </div>
        </form>
    );
}
