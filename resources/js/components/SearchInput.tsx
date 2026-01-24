import { Patient } from "@/types";
import { LucideIcon } from "lucide-react";
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
  icon?:LucideIcon
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
    icon,
}: SearchInputProps) {
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [showList, setShowList] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
const IconComponent = icon;
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
    <div className=" group relative  w-full" ref={containerRef}>
                 <label
                htmlFor={name}
                className={`absolute right-2 flex items-center gap-x-2 bg-white px-1 text-sm text-gray-400 transition-all duration-300 ${value ? 'top-[-0.7rem] text-xs text-blue-700' : 'top-1/4 text-sm text-gray-400'} `}
            >
                {IconComponent && (
                    <span className="mr-1 inline-block ">
                        <IconComponent size={18} className='text-blue-600 ' />
                    </span>
                )}
                {label}
            </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
       className={`peer w-full rounded-xl border border-gray-300 bg-white px-10 py-3 text-gray-700 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
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
