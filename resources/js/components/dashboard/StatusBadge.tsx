import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Activity, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import React from 'react';

interface StatusBadgeProps {
    status: string;
}

export const StatusBadge = React.memo(function StatusBadge({ status }: StatusBadgeProps) {
    const config: Record<string, { icon: React.ComponentType<{ className?: string }>; style: string; label: string }> =
        {
            confirmed: {
                icon: CheckCircle2,
                style: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100 hover:bg-emerald-100',
                label: 'مؤكد',
            },
            completed: {
                icon: CheckCircle2,
                style: 'bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100 hover:bg-blue-100',
                label: 'مكتمل',
            },
            cancelled: {
                icon: XCircle,
                style: 'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100 hover:bg-rose-100',
                label: 'ملغى',
            },
            pending: {
                icon: Clock,
                style: 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100 hover:bg-amber-100',
                label: 'في الانتظار',
            },
            'checked-in': {
                icon: Activity,
                style: 'bg-violet-50 text-violet-700 border-violet-200 shadow-violet-100 hover:bg-violet-100',
                label: 'حضر',
            },
        };

    const {
        icon: Icon,
        style,
        label,
    } = config[status] || {
        icon: AlertCircle,
        style: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
        label: status,
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                'gap-1.5 border py-1.5 pr-2 pl-3 font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-default',
                style,
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </Badge>
    );
});
