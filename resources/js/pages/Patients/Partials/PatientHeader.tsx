import { Button } from '@/components/ui/button';
import { patientDetails } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, Stethoscope, User, Wallet } from 'lucide-react';
import React from 'react';

interface PatientHeaderProps {
    patient: patientDetails;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
                    {patient.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {patient.name}
                    </h1>
                    <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                            <User className="h-4 w-4" /> رقم الملف: #
                            {patient.id}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> التسجيل:{' '}
                            {new Date(
                                patient?.medical_record?.created_at,
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <Link
                    href={`/appointments/create?patient_id=${patient?.id}`}
                >
                    <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                        <Calendar className="h-4 w-4" /> موعد جديد
                    </Button>
                </Link>
                <Link href={`/payments/create/${patient?.id}`}>
                    <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                        <Wallet className="h-4 w-4" /> إضافة دفعة
                    </Button>
                </Link>
                <Link href={`/procedures/create/${patient?.id}`}>
                    <Button
                        variant="outline"
                        className="gap-2 border-slate-300"
                    >
                        <Stethoscope className="h-4 w-4" /> إضافة إجراء
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default React.memo(PatientHeader);
