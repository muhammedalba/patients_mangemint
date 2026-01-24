import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react';
import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    currency?: string;
    icon: React.ComponentType<{ className?: string }>;
    subtitle?: string;
    trend?: 'up' | 'down';
    gradient?: string;
    bgGradient?: string;
    iconBg?: string;
    glowColor?: 'blue' | 'violet' | 'emerald' | 'amber';
}

export const MetricCard = React.memo(function MetricCard({
    title,
    value,
    currency,
    icon: Icon,
    subtitle,
    trend,
    bgGradient,
    iconBg,
    glowColor,
}: MetricCardProps) {
    const glowClasses: Record<string, string> = {
        blue: 'hover:shadow-blue-200/50',
        violet: 'hover:shadow-violet-200/50',
        emerald: 'hover:shadow-emerald-200/50',
        amber: 'hover:shadow-amber-200/50',
    };

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 transition-all duration-300',
                'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl',
                bgGradient,
                glowClasses[glowColor || 'blue'],
            )}
        >
            {/* Background decoration with animation */}
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-white/40 blur-2xl transition-transform duration-500 group-hover:scale-125" />
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/30 blur-2xl transition-transform duration-500 group-hover:scale-125" />

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl',
                            iconBg,
                        )}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                    {trend && (
                        <div
                            className={cn(
                                'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 group-hover:scale-105',
                                trend === 'up'
                                    ? 'bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-200'
                                    : 'bg-rose-100 text-rose-700 shadow-sm shadow-rose-200',
                            )}
                        >
                            {trend === 'up' ? (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            ) : (
                                <ArrowDownRight className="h-3.5 w-3.5" />
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-slate-600">
                        {title}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-900 transition-transform duration-300 group-hover:scale-105">
                        {currency && (
                            <span className="text-lg text-slate-500">
                                {currency}
                            </span>
                        )}
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                            <Sparkles className="h-3 w-3" />
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
});
