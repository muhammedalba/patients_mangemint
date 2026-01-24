import { cn } from '@/lib/utils';
import React from 'react';

interface MiniStatCardProps {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color?: 'cyan' | 'teal' | 'rose' | 'emerald';
}

export const MiniStatCard = React.memo(function MiniStatCard({ 
    label, 
    value, 
    icon: Icon, 
    color = 'cyan' 
}: MiniStatCardProps) {
    const colorMap: Record<string, { bg: string; icon: string; text: string; hover: string; glow: string }> =
        {
            cyan: {
                bg: 'bg-cyan-50',
                icon: 'bg-cyan-500',
                text: 'text-cyan-600',
                hover: 'hover:border-cyan-200',
                glow: 'hover:shadow-cyan-100/50',
            },
            teal: {
                bg: 'bg-teal-50',
                icon: 'bg-teal-500',
                text: 'text-teal-600',
                hover: 'hover:border-teal-200',
                glow: 'hover:shadow-teal-100/50',
            },
            rose: {
                bg: 'bg-rose-50',
                icon: 'bg-rose-500',
                text: 'text-rose-600',
                hover: 'hover:border-rose-200',
                glow: 'hover:shadow-rose-100/50',
            },
            emerald: {
                bg: 'bg-emerald-50',
                icon: 'bg-emerald-500',
                text: 'text-emerald-600',
                hover: 'hover:border-emerald-200',
                glow: 'hover:shadow-emerald-100/50',
            },
        };

    const colors = colorMap[color];

    return (
        <div
            className={cn(
                'group flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 transition-all duration-300',
                'hover:-translate-y-0.5 hover:shadow-lg',
                colors.hover,
                colors.glow,
            )}
        >
            <div
                className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg',
                    colors.icon,
                )}
            >
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800 transition-transform duration-300 group-hover:scale-105">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
            </div>
        </div>
    );
});
