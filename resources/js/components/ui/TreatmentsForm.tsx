import { Service } from '@/types';
import React, { useState } from 'react';

interface Props {
  services: Service[];
  onSelect?: (treatment: Service) => void;
}

const TreatmentsForm: React.FC<Props> = ({ services, onSelect }) => {
  const [selected, setSelected] = useState<Service | null>(null);

  if (!services || !Array.isArray(services) || services.length === 0) {
    return <p className="text-gray-500">لا توجد بيانات للمعالجات.</p>;
  }

  const categories = Array.from(new Set(services.map(s => s.category)));

  const handleSelect = (category: string, treatmentName: string) => {
    const treatment = services.find(
      t => t.name === treatmentName && t.category === category
    );
    if (treatment) {
      setSelected(treatment);
      onSelect?.(treatment);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-row gap-4 flex-wrap">
        {categories.map((category, index) => (
          <div key={index} className="min-w-[220px]">
            <label className="block text-gray-700 text-right mb-1">{category}</label>

            <select
  className="border px-2 py-1 rounded w-full"
  value={selected && selected.category === category ? selected.name : ''}
  onChange={(e) => handleSelect(category, e.target.value)}
>
  <option value="">اختر معالجة</option>
  {services
    .filter(t => t.category === category)
    .map(t => (
      <option key={t.id} value={t.name}>
        {t.name}
      </option>
    ))}
</select>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentsForm;
