import { LucideIcon } from "lucide-react";
import InputError from "./input-error";

interface FormSelectProps<T extends string> {
    label: string;
    name: string;
    value: T | T[]; // allow array for multiple
    onChange: (value: T | T[]) => void;
    options: { value: T; label: string }[];
    error?: string;
    multiple?: boolean;
    icon?:LucideIcon;
}

export function FormSelect<T extends string>({
    label,
    name,
    value,
    onChange,
    options,
    error,
    multiple = false,
    icon,
}: FormSelectProps<T>) {
    const IconComponent = icon;
    return (
        <div className="group m-2  relative w-full h-fit">
            <label
                htmlFor={name}
                className={`pointer-events-none absolute right-2 rounded-2xl p-1 flex items-center gap-x-2 bg-white px-1 text-sm text-gray-400 transition-all duration-300 ${value || name == 'start_time' ? '-top-4 text-xs text-blue-700 w-fit' : 'w-1/2 top-1/5 text-sm text-gray-400'} `}
            >
                {IconComponent && (
                    <span className="mr-1 inline-block text-blue-400">
                       <IconComponent size={16} />
                    </span>
                )}
                {label}
            </label>

            <select
                id={name}
                name={name}
                multiple={multiple}
                value={value}
                onChange={(e) => {
                    if (multiple) {
                        const selected = Array.from(
                            e.target.selectedOptions,
                        ).map((opt) => opt.value as T);
                        onChange(selected);
                    } else {
                        onChange(e.target.value as T);
                    }
                }}
                className={`peer w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-3 text-gray-700 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
            >
                {!multiple && <option value="">{label}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <InputError message={error} className="mt-1" />
        </div>
    );
}
