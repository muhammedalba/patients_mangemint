import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';

interface ProcedureItemProps {
    name: string;
    count: number;
    max: number;
    rank: number;
}

export const ProcedureItem = React.memo(function ProcedureItem({ name, count, max, rank }: ProcedureItemProps) {
    const percentage = useMemo(() => Math.min(100, Math.max(8, (count / max) * 100)), [count, max]);

    const colors = [
        'from-cyan-500 to-teal-500',
        'from-violet-500 to-purple-500',
        'from-amber-500 to-orange-500',
        'from-rose-500 to-pink-500',
        'from-emerald-500 to-green-500',
    ];

    return (
        <div className="group cursor-default">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
                            colors[rank - 1] || colors[0],
                        )}
                    >
                        {rank}
                    </span>
                    <span className="text-sm font-medium text-slate-700 transition-colors duration-200 group-hover:text-cyan-600">
                        {name}
                    </span>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 transition-all duration-200 group-hover:bg-cyan-100 group-hover:text-cyan-700">
                    {count}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className={cn(
                        'h-full rounded-full bg-gradient-to-l transition-all duration-700 ease-out group-hover:brightness-110',
                        colors[rank - 1] || colors[0],
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
});
