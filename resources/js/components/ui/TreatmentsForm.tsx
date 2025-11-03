import { TreatmentCategories } from '@/types/treatments';
import React, { useState } from 'react';

interface Props {
  onSelect?: (treatment: { name: string; cost: number }) => void;
}

const TreatmentsForm: React.FC<Props> = ({ onSelect }) => {
  const [selected, setSelected] = useState<{ name: string; cost: number } | null>(null);

  const handleSelect = (categoryIndex: number, treatmentName: string) => {
    const treatment = TreatmentCategories[categoryIndex].treatments.find(t => t.name === treatmentName);
    if (treatment) {
      setSelected(treatment);
      onSelect?.(treatment); // send selected treatment to parent
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-row gap-2">
        {TreatmentCategories.map((category, index) => (
          <div key={index}>
            <label className="block text-gray-700 text-right text-right">{category.name}</label>
            <select
              className="border px-2 py-1 rounded"
              onChange={(e) => handleSelect(index, e.target.value)}
            >
              <option value="">اختر معالجة</option>
              {category.treatments.map((treatment, i) => (
                <option key={i} value={treatment.name}>
                  {treatment.name}
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
