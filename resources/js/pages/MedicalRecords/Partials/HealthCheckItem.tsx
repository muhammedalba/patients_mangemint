import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface HealthCheckItemProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon: LucideIcon;
}

export function HealthCheckItem({
    id,
    label,
    checked,
    onChange,
    icon: Icon,
}: HealthCheckItemProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-lg border p-4 transition-all',
                checked
                    ? 'border-teal-200 bg-teal-50/50'
                    : 'border-slate-200 bg-white hover:bg-slate-50',
            )}
        >
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(c) => onChange(Boolean(c))}
                className="data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600"
            />
            <div className="flex items-center gap-2">
                <Icon
                    className={cn(
                        'h-4 w-4',
                        checked ? 'text-teal-600' : 'text-slate-400',
                    )}
                />
                <Label
                    htmlFor={id}
                    className="cursor-pointer font-medium text-slate-700"
                >
                    {label}
                </Label>
            </div>
        </div>
    );
}
