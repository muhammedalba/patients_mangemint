interface FormSelectProps<T extends string> {
  label: string;
  name: string;
  value: T | T[]; // allow array for multiple
  onChange: (value: T | T[]) => void;
  options: { value: T; label: string }[];
  error?: string;
  multiple?: boolean;
}

export function FormSelect<T extends string>({
  label,
  name,
  value,
  onChange,
  options,
  error,
  multiple = false,
}: FormSelectProps<T>) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        multiple={multiple}
        value={value}
        onChange={(e) => {
          if (multiple) {
            const selected = Array.from(e.target.selectedOptions).map(
              (opt) => opt.value as T
            );
            onChange(selected);
          } else {
            onChange(e.target.value as T);
          }
        }}
        className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {!multiple && <option value="">{label}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
