import { Link as InertiaLink } from "@inertiajs/react";
import { route } from "ziggy-js";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  showSearch?: boolean;
  showButton?: boolean;
  buttonLabel?: string;
  buttonRoute?: string;
}

export function SearchBar({
  value,
  onChange,
  showSearch = true,
  showButton = false,
  buttonLabel = "إضافة",
  buttonRoute,
}: SearchBarProps) {
  return (
    <div className="flex items-center justify-between">
        {showButton && buttonRoute && (
        <InertiaLink
          href={route(buttonRoute)}
          className="inline-flex items-center gap-1 rounded bg-blue-500 px-4 py-2 text-white"
        >
          {buttonLabel}
          <i className="material-icons text-lg">add</i>
        </InertiaLink>
      )}

      {showSearch && (
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="بحث..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 shadow-sm transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="absolute top-2.5 left-3 text-gray-400">
            <i className="material-icons text-lg">search</i>
          </span>
        </div>
      )}
    </div>
  );
}
