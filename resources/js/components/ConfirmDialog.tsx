import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { forwardRef } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
    children: React.ReactNode;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
    disabled?: boolean;
}

const ConfirmDialog = forwardRef<HTMLButtonElement, ConfirmDialogProps>(
    ({ children, title, description, onConfirm, variant = 'danger', disabled = false, ...props }, ref) => {
        return (
            <Dialog >
                <DialogTrigger asChild ref={ref} {...props}>
                    {children}
                </DialogTrigger>
                <DialogContent dir='rtl' className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl ">
                    <div className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                                variant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                                {variant === 'danger' ? <Trash2 size={24} /> : <AlertCircle size={24} />}
                            </div>
                            <div  className="flex flex-col gap-1">
                                <DialogHeader className="text-right">
                                    <DialogTitle className="text-xl font-bold text-slate-800">
                                        {title}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500 font-medium">
                                        {description}
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="bg-slate-50/80 px-6 py-4 flex flex-row-reverse justify-start gap-3 border-t border-slate-100">
                        <DialogClose asChild>
                            <Button 
                                variant="outline" 
                                className="h-10 px-6 font-semibold text-slate-600 hover:bg-slate-100 border-slate-200 transition-all active:scale-95"
                            >
                                إلغاء
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button 
                                onClick={onConfirm} 
                                variant={variant === 'danger' ? 'destructive' : 'default'}
                                disabled={disabled}
                                className={`h-10 px-8 font-bold shadow-lg shadow-rose-200/50 transition-all active:scale-95 ${
                                    variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : ''
                                }`}
                            >
                                تأكيد
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }
);

export default ConfirmDialog;
