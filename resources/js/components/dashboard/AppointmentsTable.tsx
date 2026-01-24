import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Clock, Stethoscope } from 'lucide-react';
import React from 'react';
import { ToothIcon } from './DentalIcons';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';

interface Appointment {
    id: number;
    patient?: { name: string };
    service?: { name: string };
    doctor?: { name: string };
    start_time: string;
    end_time: string;
    status: string;
}

interface AppointmentsTableProps {
    appointments: Appointment[];
}

export const AppointmentsTable = React.memo(function AppointmentsTable({ appointments }: AppointmentsTableProps) {
    if (!appointments || appointments.length === 0) {
        return <EmptyState message="لا توجد مواعيد مجدولة لهذا اليوم" />;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-100 transition-all duration-300 hover:border-slate-200">
            <Table>
                <TableHeader className="bg-gradient-to-l from-slate-50 to-slate-100/50">
                    <TableRow className="border-b border-slate-200 hover:bg-transparent">
                        <TableHead className="py-4 text-right font-semibold text-slate-700">
                            المريض
                        </TableHead>
                        <TableHead className="py-4 text-right font-semibold text-slate-700">
                            موعد الجلسة
                        </TableHead>
                        <TableHead className="py-4 text-right font-semibold text-slate-700">
                            طبيب الأسنان
                        </TableHead>
                        <TableHead className="py-4 text-right font-semibold text-slate-700">
                            الحالة
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((app, index) => (
                        <TableRow
                            key={app.id}
                            className={cn(
                                'transition-all duration-200 hover:bg-gradient-to-l hover:from-cyan-50/80 hover:to-teal-50/50',
                                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30',
                            )}
                        >
                            <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 text-sm font-bold text-white shadow-md transition-transform duration-300 hover:scale-110">
                                            {(app.patient?.name || 'م').charAt(0)}
                                        </div>
                                        <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-800 transition-colors duration-200 hover:text-cyan-700">
                                            {app.patient?.name}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <ToothIcon className="h-3 w-3" />
                                            {app.service?.name}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 transition-colors duration-200 hover:bg-slate-100">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span className="font-medium text-slate-700 tabular-nums">
                                        {app.start_time}
                                    </span>
                                    <span className="text-slate-400">-</span>
                                    <span className="font-medium text-slate-700 tabular-nums">
                                        {app.end_time}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 transition-all duration-200 hover:bg-violet-200 hover:scale-110">
                                        <Stethoscope className="h-4 w-4 text-violet-600" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">
                                        د. {app.doctor?.name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={app.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
});
