import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface AmenitiesSelectorProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function AmenitiesSelector({ label, options, selected, onChange }: AmenitiesSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
    setSearchTerm('');
  };

  const removeOption = (option: string) => {
    onChange(selected.filter(item => item !== option));
  };

  const unselectedOptions = options.filter(opt => !selected.includes(opt));
  const filteredOptions = unselectedOptions.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">{label}</label>
      
      <div className="relative">
        <div 
          className="flex items-center w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 cursor-text focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all"
          onClick={() => setIsOpen(true)}
        >
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
            placeholder={`Buscar ou adicionar ${label.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <ul className="py-1">
                {filteredOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => toggleOption(option)}
                    className="px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-400 cursor-pointer"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-sm text-center text-gray-500 dark:text-zinc-400">
                {searchTerm ? 'Nenhuma opção encontrada.' : 'Todas as opções já foram selecionadas.'}
              </div>
            )}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selected.map((item) => (
            <div
              key={item}
              className="flex items-center bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-zinc-200 mr-2">{item}</span>
              <button
                type="button"
                onClick={() => removeOption(item)}
                className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-zinc-700 rounded-full p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
