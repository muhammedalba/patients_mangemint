import { cn } from '@/lib/utils';
import React from 'react';
import { ToothIcon } from './DentalIcons';

interface EmptyStateProps {
    message: string;
    small?: boolean;
}

export const EmptyState = React.memo(function EmptyState({ message, small }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'group flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50/30 text-center transition-all duration-300 hover:border-cyan-300 hover:from-cyan-50/50 hover:to-teal-50/30',
                small ? 'py-8' : 'py-12',
            )}
        >
            <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-all duration-300 group-hover:shadow-md group-hover:ring-cyan-200">
                <ToothIcon
                    className={cn(
                        'text-slate-400 transition-all duration-300 group-hover:text-cyan-500 group-hover:scale-110',
                        small ? 'h-5 w-5' : 'h-6 w-6',
                    )}
                />
            </div>
            <p className="text-sm font-medium text-slate-500 transition-colors duration-300 group-hover:text-slate-600">{message}</p>
        </div>
    );
});
