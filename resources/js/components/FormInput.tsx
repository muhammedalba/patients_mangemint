import { LucideIcon } from 'lucide-react';
interface FormInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    error?: string;
    type?: string;
    icon?: LucideIcon;
    disabled?: boolean;
    min?: string;
    max?: string;
}

export function FormInput({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    error,
    type = 'text',
    icon,
    disabled = false,
    min,
    max,
}: FormInputProps) {
    const IconComponent = icon;
    return (
        <div className="group relative m-2 w-full">
            <input
                id={name}
                disabled={disabled}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                min={min}
                max={max}
                className={`peer w-full rounded-xl border border-gray-300 bg-white px-10 py-3 text-gray-700 transition-all duration-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none`}
            />
            <label
                htmlFor={name}
                className={`pointer-events-none absolute right-2 flex items-center gap-x-2 rounded-2xl bg-white px-3 py-1 text-sm text-gray-400 transition-all duration-300 ${value || type == 'date' || name == 'birth_date' ? '-top-4 text-xs text-blue-700' : 'top-1/5 text-sm text-gray-400'} `}
            >
                {IconComponent && (
                    <span className="mr-1 inline-block">
                        <IconComponent size={18} className="text-blue-600" />
                    </span>
                )}
                {label}
            </label>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
