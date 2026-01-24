import React, { useMemo } from 'react';

interface ExpenseItemProps {
    name: string;
    amount: number;
    totalExpense: number;
}

export const ExpenseItem = React.memo(function ExpenseItem({ name, amount, totalExpense }: ExpenseItemProps) {
    const percentage = useMemo(() => Math.min(100, (amount / totalExpense) * 100) || 0, [amount, totalExpense]);

    return (
        <div className="group cursor-default">
            <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-slate-600 transition-colors duration-200 group-hover:text-amber-700">{name}</span>
                <span className="text-sm font-bold text-slate-800 transition-colors duration-200 group-hover:text-amber-600">
                    ${Number(amount).toLocaleString()}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-400 transition-all duration-700 ease-out group-hover:brightness-110"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="w-10 text-left text-xs font-medium text-slate-400 tabular-nums transition-colors duration-200 group-hover:text-amber-500">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
});
