import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';
import { useAppToast } from '@/utils/toast';

export default function DiscountForm({ patientId }: { patientId: number }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        discount_amount:'',
    });

    const { success, warning } = useAppToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(data.discount_amount) < 0 || !Number(data.discount_amount) ) {
            return warning('قيمة الخصم يجب أن تكون صفر أو أكبر');
        }


        post(route('patients.addDiscount', patientId), {
            onSuccess: (e) => {
                success('تم إضافة الخصم بنجاح', 'تم إضافة الخصم بنجاح');
                reset();
                close();
                
            },
            onError: (e) => {
                warning(e.discount_amount??'فشل إضافة الخصم', 'يرجى التحقق من البيانات المدخلة');
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md rounded-lg bg-white p-6 shadow-md mt-2"
        >
            <FormInput
                label="أدخل قيمة الخصم"
                name="discount_amount"
                type="number"
                min={0}
                value={data.discount_amount}
                onChange={(val) => setData('discount_amount', val)}
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
