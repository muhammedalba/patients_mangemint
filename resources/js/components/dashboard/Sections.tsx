import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard } from 'lucide-react';
import React from 'react';
import { EmptyState } from './EmptyState';
import { ExpenseItem } from './ExpenseItem';
import { ProcedureItem } from './ProcedureItem';
import { AppointmentsTable } from './AppointmentsTable';
import { ToothIcon } from './DentalIcons';

// Types
interface Appointment {
    id: number;
    patient?: { name: string };
    service?: { name: string };
    doctor?: { name: string };
    start_time: string;
    end_time: string;
    status: string;
}

interface Procedure {
    name: string;
    total: number;
}

interface ExpenseCategory {
    category_name: string;
    total: number;
}

// Appointments Section Component
interface AppointmentsSectionProps {
    appointments: Appointment[];
    appointmentsCount: number;
}

export const AppointmentsSection = React.memo(function AppointmentsSection({
    appointments,
    appointmentsCount,
}: AppointmentsSectionProps) {
    return (
        <div className="lg:col-span-2">
            <div className="group h-full rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:border-cyan-200/60 hover:shadow-lg hover:shadow-cyan-100/50">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-105">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                جدول المواعيد اليوم
                            </h2>
                            <p className="text-xs text-slate-500">
                                جلسات العلاج والفحص المجدولة
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="border-0 bg-cyan-100 px-3 py-1.5 text-cyan-700 transition-all duration-300 hover:bg-cyan-200">
                            <span className="text-lg font-bold">{appointmentsCount}</span>
                            <span className="mr-1 text-xs">مواعيد</span>
                        </Badge>
                    </div>
                </div>

                <AppointmentsTable appointments={appointments} />
            </div>
        </div>
    );
});

// Top Procedures Section Component
interface TopProceduresSectionProps {
    procedures: Procedure[];
    maxCount: number;
}

export const TopProceduresSection = React.memo(function TopProceduresSection({
    procedures,
    maxCount,
}: TopProceduresSectionProps) {
    return (
        <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:border-violet-200/60 hover:shadow-lg hover:shadow-violet-100/50">
            <div className="mb-5 flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30 transition-transform duration-300 group-hover:scale-105">
                    <ToothIcon className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">
                        العلاجات الأكثر طلباً
                    </h3>
                    <p className="text-xs text-slate-500">
                        هذا الشهر
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                {procedures.map((proc, i) => (
                    <ProcedureItem
                        key={i}
                        name={proc.name}
                        count={proc.total}
                        max={maxCount}
                        rank={i + 1}
                    />
                ))}
                {procedures.length === 0 && (
                    <EmptyState
                        message="لا توجد بيانات للإجراءات"
                        small
                    />
                )}
            </div>
        </div>
    );
});

// Expense Categories Section Component
interface ExpenseCategoriesSectionProps {
    categories: ExpenseCategory[];
    totalExpense: number;
}

export const ExpenseCategoriesSection = React.memo(function ExpenseCategoriesSection({
    categories,
    totalExpense,
}: ExpenseCategoriesSectionProps) {
    if (categories.length === 0) return null;

    return (
        <div className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:border-amber-200/60 hover:shadow-lg hover:shadow-amber-100/50">
            <div className="mb-5 flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-transform duration-300 group-hover:scale-105">
                    <CreditCard className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">
                        توزيع المصروفات
                    </h3>
                    <p className="text-xs text-slate-500">
                        هذا الشهر
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                {categories.map((cat, i) => (
                    <ExpenseItem
                        key={i}
                        name={cat.category_name}
                        amount={cat.total}
                        totalExpense={totalExpense}
                    />
                ))}
            </div>
        </div>
    );
});
