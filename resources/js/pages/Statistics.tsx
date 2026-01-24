import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Appointment, BreadcrumbItem, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import type { LucideIcon } from "lucide-react";

import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Clock,
    Activity,
    CheckCircle2,
    XCircle,
    AlertCircle,

} from 'lucide-react';
import { cn } from '@/lib/utils';

const ClockDisplay = React.lazy(() => import('@/components/ClockDisplay').then((module) => ({ default: module.ClockDisplay })));

const Breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'جدول اليوم',
        href: '/today',
    },
];


type StatisticsProps = PageProps<{ stats: { appointmentsToday: Appointment[]; }; }>;
export default function Statistics() {
const { stats } = usePage<StatisticsProps>().props;

    return (
        <AppLayout breadcrumbs={Breadcrumbs}>
             <Head title="جدول اليوم" />

            <div className="flex min-h-screen flex-1 flex-col gap-6 bg-slate-50/50 p-6 pt-2 font-sans">

                {/* Hero Clock Section */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-lg ring-1 ring-slate-900/5">
                     {/* Abstract Background Decoration */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center md:flex-row md:justify-between md:text-right">
                        <div>
                            <ClockDisplay />

                        </div>

                        <div className="mt-4 flex items-center gap-4 md:mt-0">
                           <div className="text-center rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
                                <div className="text-3xl font-bold">{stats.appointmentsToday?.length || 0}</div>
                                <div className="text-xs text-indigo-200">مواعيد اليوم</div>
                           </div>
                           <img src='/zirconLogo.png' alt='Zircon Logo' className='h-16 w-auto opacity-90 brightness-0 invert' />
                        </div>
                    </div>
                </div>

                {/* Appointments Table Section */}
                <div className="flex flex-col gap-4">
                     <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-600" />
                            قائمة المواعيد
                        </h2>
                     </div>

                    <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
                        <CardContent className="p-0">
                            <PremiumAppointmentsTable appointments={stats.appointmentsToday} />
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}

function PremiumAppointmentsTable({ appointments }: { appointments: Appointment[] }) {
    if (!appointments || appointments.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-slate-50 p-4 ring-1 ring-slate-100 mb-4">
                     <Clock className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">لا توجد مواعيد</h3>
                <p className="text-slate-500">لا توجد مواعيد مجدولة لهذا اليوم حتى الآن.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader className="bg-slate-50/80">
                <TableRow className="hover:bg-transparent">
                    <TableHead className="w-45 text-right font-semibold text-slate-600">الوقت</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">المريض</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">الطبيب</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">الخدمة</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">الحالة</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map((app) => (
                    <TableRow key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="font-semibold text-slate-700 bg-slate-50/30 group-hover:bg-transparent transition-colors tabular-nums">
                            {app.start_time} - {app.end_time}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 ring-2 ring-white">
                                    {(app.patient?.name || 'P').charAt(0)}
                                </div>
                                <span className="font-medium text-slate-900">{app.patient?.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium">
                            {app.doctor?.name}
                        </TableCell>
                         <TableCell className="text-slate-500">
                            {app.service?.name}
                        </TableCell>
                        <TableCell>
                            <StatusBadge status={app.status} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { icon: LucideIcon, style: string, label: string }> = {
        confirmed: { icon: CheckCircle2, style: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "مؤكد" },
        completed: { icon: CheckCircle2, style: "bg-blue-100 text-blue-700 border-blue-200", label: "مكتمل" },
        cancelled: { icon: XCircle, style: "bg-rose-100 text-rose-700 border-rose-200", label: "ملغى" },
        pending: { icon: Clock, style: "bg-amber-100 text-amber-700 border-amber-200", label: "معلق" },
        'checked-in': { icon: Activity, style: "bg-purple-100 text-purple-700 border-purple-200", label: "حضر" },
    };

    const { icon: Icon, style, label } = config[status] || { icon: AlertCircle, style: "bg-slate-100 text-slate-700", label: status };

    return (
        <Badge variant="outline" className={cn("gap-1.5 py-1 pr-1.5 pl-2.5 font-normal border shadow-sm w-fit", style)}>
            <Icon className="h-3.5 w-3.5" />
            {label}
        </Badge>
    );
}
