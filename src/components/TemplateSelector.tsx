import React from 'react';
import { TemplateId } from '../types';

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const templates: { id: TemplateId; name: string; preview: React.ReactNode }[] = [
  { 
    id: 'modern', 
    name: 'Modern',
    preview: (
      <div className="w-full h-16 bg-gray-200 relative overflow-hidden rounded-md mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 space-y-1">
          <div className="w-1/2 h-2 bg-blue-500 rounded-full" />
          <div className="w-3/4 h-2 bg-white rounded-full" />
        </div>
      </div>
    )
  },
  { 
    id: 'elegant', 
    name: 'Card Vidro',
    preview: (
      <div className="w-full h-16 bg-gray-200 relative overflow-hidden rounded-md mb-2">
        <div className="absolute bottom-1 left-1 right-1 h-8 bg-white/70 backdrop-blur-sm border border-white/40 rounded shadow-sm p-1 flex flex-col justify-end">
           <div className="w-3/4 h-1.5 bg-gray-800 rounded-full mb-1" />
           <div className="w-1/2 h-1.5 bg-gray-500 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    id: 'luxury', 
    name: 'Premium Dark',
    preview: (
      <div className="w-full h-16 bg-zinc-800 relative overflow-hidden rounded-md mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 border-l-2 border-gray-400 pl-1 space-y-1">
          <div className="w-3/4 h-2 bg-white rounded-full" />
          <div className="w-1/2 h-1.5 bg-gray-400 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    id: 'bold', 
    name: 'Impacto',
    preview: (
      <div className="w-full h-16 bg-gray-300 relative overflow-hidden rounded-md mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 h-8 p-1 flex flex-col justify-end">
          <div className="w-full h-2 bg-white rounded-sm mb-1 italic" />
          <div className="w-1/2 h-2 bg-red-500 rounded-sm" />
        </div>
      </div>
    )
  },
  { 
    id: 'minimalist', 
    name: 'Clean',
    preview: (
      <div className="w-full h-16 bg-white relative overflow-hidden rounded-md mb-2 border border-gray-200">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 rounded-b-lg" />
        <div className="absolute bottom-1 left-1 right-1 space-y-1">
          <div className="w-3/4 h-2 bg-gray-800 rounded-full" />
          <div className="flex justify-between">
            <div className="w-4 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-4 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-4 h-1.5 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    )
  },
];

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Selecione o Modelo</label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className={`p-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center ${
              selected === tpl.id
                ? 'bg-blue-50 ring-2 ring-blue-600 text-blue-800 shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tpl.preview}
            {tpl.name}
          </button>
        ))}
      </div>
    </div>
  );
}
