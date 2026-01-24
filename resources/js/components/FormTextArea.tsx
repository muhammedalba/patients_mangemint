import { LucideIcon } from 'lucide-react';
import InputError from './input-error';

interface FormTextareaProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    rows?: number;
    icon?: LucideIcon;
    className?: string;
}

export function FormTextArea({
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    rows = 4,
    className,
    icon,
}: FormTextareaProps) {
    const IconComponent = icon;
    return (
        <div className={`relative ${className}`}>
            <label
                htmlFor={name}
                className={`absolute right-2 flex items-center gap-x-2 rounded-2xl bg-white px-3 py-1 text-sm text-gray-400 transition-all duration-300 ${value ? '-top-4 text-xs text-blue-700' : 'top-4 text-sm text-gray-400'} `}
            >
                {IconComponent && (
                    <IconComponent className="mr-2 inline h-4 text-blue-500" />
                )}
                {label}
            </label>

            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border px-4 py-3 text-lg leading-relaxed focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />

            <InputError message={error} className="mt-1" />
        </div>
    );
}
