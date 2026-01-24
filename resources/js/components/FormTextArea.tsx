import { LucideIcon } from 'lucide-react';

interface FormTextareaProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    rows?: number;
    icon?: LucideIcon;
}

export function FormTextArea({
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    rows = 4,
    icon,
}: FormTextareaProps) {
    const IconComponent = icon;
    return (
        <div className="relative ">
            <label
                htmlFor={name}
                className={`absolute right-2 rounded-2xl py-1 px-3  bg-white flex items-center gap-x-2  text-sm text-gray-400 transition-all duration-300 ${value  ? '-top-4 text-xs text-blue-700 ' : 'top-4 text-sm text-gray-400 '} `}
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

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
