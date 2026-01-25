import DentalChart from '@/components/odontogram/DentalChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Procedure, Tooth } from '@/types';
import { Activity } from 'lucide-react';
import React from 'react';

interface DentalChartCardProps {
    teeth: Tooth[];
    getToothClasses: (toothNumber: number) => string;
    getLastProcedure: (toothNumber: number) => Procedure | null;
    onToothSelect: (toothNumber: number) => void;
}

const DentalChartCard: React.FC<DentalChartCardProps> = ({
    teeth,
    getToothClasses,
    getLastProcedure,
    onToothSelect,
}) => {
    return (
        <Card className="overflow-hidden border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    المخطط السني (Dental Chart)
                </CardTitle>
                <CardDescription>
                    اضغط على السن لإضافة أو عرض الإجراءات
                </CardDescription>
            </CardHeader>
            <CardContent className="relative min-h-[400px] p-6">
                <DentalChart
                    teeth={teeth}
                    getToothClasses={getToothClasses}
                    getLastProcedure={getLastProcedure}
                    onToothSelect={onToothSelect}
                />
            </CardContent>
        </Card>
    );
};

export default React.memo(DentalChartCard);
