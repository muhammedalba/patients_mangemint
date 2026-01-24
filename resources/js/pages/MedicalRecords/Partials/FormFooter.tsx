import { FormButton } from '@/components/FormButton';
import { Button } from '@/components/ui/button';

interface FormFooterProps {
    processing: boolean;
    submitLabel: string;
    onCancel?: () => void;
}

export function FormFooter({
    processing,
    submitLabel,
    onCancel,
}: FormFooterProps) {
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            window.history.back();
        }
    };

    return (
        <div className="sticky bottom-4 z-50 mt-8 flex items-center justify-end gap-3 rounded-lg bg-white/80 p-4 shadow-lg ring-1 ring-slate-900/5 backdrop-blur">
            <Button
                className="cursor-pointer bg-red-500 px-6 text-white transition-colors duration-300 ease-in-out hover:scale-105 hover:bg-red-800 hover:text-white"
                onClick={handleCancel}
                variant="ghost"
                type="button"
            >
                إلغاء
            </Button>
            <FormButton
                processing={processing}
                label={submitLabel}
                loadingLabel="جارِ الحفظ..."
            />
        </div>
    );
}
