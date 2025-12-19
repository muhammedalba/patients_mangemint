interface Role {
  key: string;
  label: string;
}

interface FormRolesProps {
  label: string;
  availableRoles: Role[];
  selectedRoles: string[];
  toggleRole: (roleKey: string) => void;
  error?: string;
}

export function FormRoles({
  label,
  availableRoles,
  selectedRoles,
  toggleRole,
  error,
}: FormRolesProps) {
  return (
    <div>
      <label className="mb-1 block text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {availableRoles.map((role) => {
          const selected = selectedRoles.includes(role.key);
          return (
            <button
              key={role.key}
              type="button"
              onClick={() => toggleRole(role.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                selected
                  ? "border-green-600 bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {role.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
