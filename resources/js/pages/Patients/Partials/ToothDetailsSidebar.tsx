import { Button } from '@/components/ui/button';
import { Procedure } from '@/types';
import { Plus, Stethoscope } from 'lucide-react';
import React from 'react';

interface ToothDetailsSidebarProps {
    showSideBar: boolean;
    toothNumber: number | null;
    procedures: Procedure[];
    onClose: () => void;
    onOpenProcedureForm: (toothNumber: number) => void;
}

const ToothDetailsSidebar: React.FC<ToothDetailsSidebarProps> = ({
    showSideBar,
    toothNumber,
    procedures,
    onClose,
    onOpenProcedureForm,
}) => {
    if (!showSideBar || toothNumber === null) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-400">
                <Stethoscope className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p className="text-sm">
                    اضغط على أي سن في المخطط لعرض التفاصيل أو
                    إضافة علاج.
                </p>
            </div>
        );
    }

    return (
        <div className="sticky top-6 animate-in rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-sm duration-300 slide-in-from-right-4">
            <div className="mb-4 flex items-center justify-between border-b border-indigo-100 pb-3">
                <h3 className="flex items-center gap-2 font-bold text-indigo-900">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    تفاصيل سن {toothNumber}
                </h3>
                <button
                    onClick={onClose}
                    className="text-indigo-400 hover:text-indigo-700"
                >
                    ✕
                </button>
            </div>

            {procedures?.length ? (
                <div className="mb-6 space-y-3">
                    {procedures.map((p) => (
                        <div
                            key={p.id}
                            className="relative border-l-2 border-indigo-200 pl-4"
                        >
                            <div className="text-sm font-semibold text-slate-800">
                                {p.name}
                            </div>
                            <div className="text-xs text-slate-500">
                                {new Date(
                                    p.processing_date,
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-6 text-center text-sm font-medium text-indigo-400">
                    لا توجد إجراءات مسجلة
                </div>
            )}

            <Button
                onClick={() => onOpenProcedureForm(toothNumber)}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
                <Plus className="mr-2 h-4 w-4" /> إدراج
                إجراء جديد
            </Button>
        </div>
    );
};

export default React.memo(ToothDetailsSidebar);
