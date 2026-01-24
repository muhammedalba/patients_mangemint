import { Link as InertiaLink } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { route } from 'ziggy-js';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    showSearch?: boolean;
    showButton?: boolean;
    buttonLabel?: string;
    buttonRoute?: string;
    className?: string;
}

export function SearchBar({
    value,
    onChange,
    showSearch = true,
    showButton = false,
    buttonLabel = 'إضافة',
    buttonRoute,
    className = '',
}: SearchBarProps) {
    return (
        <div
            className={`${className} mb-4 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4`}
        >
            {showButton && buttonRoute && (
                <InertiaLink
                    href={route(buttonRoute)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white shadow transition-colors duration-200 hover:bg-blue-700"
                >
                    <Plus size={18} />
                    {buttonLabel}
                </InertiaLink>
            )}

            {showSearch && (
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="بحث..."
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                    </span>
                </div>
            )}
        </div>
    );
}
