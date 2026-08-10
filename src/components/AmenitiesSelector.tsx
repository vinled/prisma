import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AmenitiesSelectorProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function AmenitiesSelector({ label, options, selected, onChange }: AmenitiesSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option: string) => {
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </button>
      </div>

      {isOpen && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selected.includes(option)
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((item) => (
            <div
              key={item}
              className="flex items-center bg-gray-100 px-3 py-1 rounded-full border border-gray-200"
            >
              <span className="text-sm text-gray-800 mr-2">{item}</span>
              <button
                type="button"
                onClick={() => removeOption(item)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
