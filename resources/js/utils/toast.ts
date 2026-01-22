import { useToast } from '@/hooks/use-toast';

export const useAppToast = () => {
    const { toast } = useToast();

    return {
        success: (title: string, description?: string) =>
            toast({
                title,
                description,
                variant: 'success',
            }),

        error: (title: string, description?: string) =>
            toast({
                title,
                description,
                variant: 'destructive',
            }),

        info: (title: string, description?: string) =>
            toast({
                title,
                description,
            }),
    };
};
