interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}

export function FormTextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-gray-700">
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-lg
          border
          px-4
          py-3
          text-lg
          leading-relaxed
          focus:ring-2
          focus:ring-blue-500
          focus:outline-none
        "
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
