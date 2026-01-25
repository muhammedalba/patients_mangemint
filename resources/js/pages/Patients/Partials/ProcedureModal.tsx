import FormProcedure from '@/components/FormProcedure';
import { patientDetails, Procedure, ServiceCategory } from '@/types';
import React, { useEffect } from 'react';
import { X, Stethoscope } from 'lucide-react';

interface ProcedureModalProps {
    showProcedureForm: boolean;
    toothNumber: number | null;
    toothId: number;
    services_category: ServiceCategory[];
    patient: patientDetails;
    onClose: () => void;
    onCreated: (procedure: Procedure) => void;
}

const ProcedureModal: React.FC<ProcedureModalProps> = ({
    showProcedureForm,
    toothNumber,
    toothId,
    services_category,
    patient,
    onClose,
    onCreated,
}) => {
    // Prevent background scroll + ESC close
    useEffect(() => {
        if (!showProcedureForm || toothNumber === null) return;

        document.body.style.overflow = 'hidden';

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose, showProcedureForm, toothNumber]);

    if (!showProcedureForm || toothNumber === null) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">

                {/* Header */}
                <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-lg font-bold text-slate-800">
                            إجراء طبي – السن رقم {toothNumber}
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-red-500"
                        aria-label="إغلاق النافذة"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-full p-6">
                    <FormProcedure
                        services_category={services_category}
                        patient={patient}
                        toothId={toothId}
                        onClose={onClose}
                        onCreated={onCreated}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProcedureModal);
