import { Patient } from "@/types";
import { useEffect, useRef, useState } from "react";
interface SearchInputProps {
  label: string;
  name: string;
  value: string; // النص الظاهر في الحقل (اسم المريض)
  onChange: (val: string) => void; // لتحديث النص أثناء الكتابة أو بعد الاختيار
  options: Patient[]; // قائمة المرضى
  onSelect: (patient: Patient) => void; // يتم استدعاؤها عند اختيار مريض (لحفظ id خارجياً)
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function SearchInput({
  label,
  name,
  value,
  onChange,
  options,
  onSelect,
  placeholder,
  error,
  disabled,
}: SearchInputProps) {
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [showList, setShowList] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // فلترة أثناء الكتابة
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (val.trim().length > 0) {
      const f = options.filter((p) =>
        p.name.toLowerCase().includes(val.toLowerCase())
      );
      setFiltered(f);
      setShowList(f.length > 0);
    } else {
      setFiltered([]);
      setShowList(false);
    }
  };

  // اختيار عنصر من القائمة: نملأ الاسم ونحفظ id ونغلق القائمة
  const handlePick = (patient: Patient) => {
    onChange(patient.name);  // يظهر الاسم مباشرة في الحقل
    onSelect(patient);       // الصفحة تحفظ الـ id
    setShowList(false);
  };

  // إغلاق القائمة عند الضغط خارج المكوّن
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="mb-2 block text-gray-700">{label}</label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        autoComplete="off"
      />

      {showList && (
        <ul className="absolute z-20 mt-1 max-h-44 w-full overflow-y-auto rounded border border-gray-200 bg-white shadow-lg">
          {filtered.map((p) => (
            <li
              key={p.id}
              onClick={() => handlePick(p)}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
            >
              {p.name}
            </li>
          ))}

          {filtered.length === 0 && (
            <li className="px-3 py-2 text-gray-500">لا توجد نتائج مطابقة</li>
          )}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
