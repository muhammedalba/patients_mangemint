import { router } from '@inertiajs/react';
import { useAppToast } from '@/utils/toast';
import { route } from 'ziggy-js';
import { useState } from 'react';

interface UseDeleteActionOptions {
    routeName: string;
    successMessage?: string;
    successTitle?: string;
    errorMessage?: string;
    errorTitle?: string;
}

export function useDeleteAction({
    routeName,
    successMessage = 'تم الحذف بنجاح',
    successTitle = 'نجاح',
    errorMessage = 'حدث خطأ أثناء الحذف، يرجى المحاولة مرة أخرى لاحقًا',
    errorTitle = 'خطأ',
}: UseDeleteActionOptions) {
    const { success, error } = useAppToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = (id: number | string) => {
        setIsDeleting(true);
        router.delete(route(routeName, id), {
            onSuccess: () => {
                success(successTitle, successMessage);
            },
            onError: () => {
                error(errorTitle, errorMessage);
            },
        });
    };

    return {
        handleDelete,
        isDeleting,
    };
}
