import React from 'react';
import { TemplateId } from '../types';
import { Check, Star } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const templates: { id: TemplateId; name: string; tag?: string; preview: React.ReactNode }[] = [
  { 
    id: 'modern', 
    name: 'Modern',
    tag: 'Recomendado',
    preview: (
      <div className="w-full h-16 bg-slate-900 relative overflow-hidden rounded-lg mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-950/40 to-transparent" />
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-blue-500 text-[8px] font-bold text-white uppercase">
          Venda
        </div>
        <div className="absolute bottom-2 left-2 right-2 space-y-1">
          <div className="w-2/3 h-1.5 bg-white rounded-full font-bold" />
          <div className="w-1/3 h-1.5 bg-blue-400 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    id: 'elegant', 
    name: 'Card Vidro',
    preview: (
      <div className="w-full h-16 bg-stone-800 relative overflow-hidden rounded-lg mb-2">
        <div className="absolute bottom-1.5 left-1.5 right-1.5 h-9 bg-white/80 backdrop-blur-md border border-white/50 rounded-md p-1.5 flex flex-col justify-end space-y-1 shadow-sm">
          <div className="w-3/4 h-1.5 bg-gray-900 rounded-full" />
          <div className="w-1/2 h-1 bg-gray-500 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    id: 'luxury', 
    name: 'Premium Dark',
    preview: (
      <div className="w-full h-16 bg-zinc-950 relative overflow-hidden rounded-lg mb-2 border border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/60 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 border-l-2 border-amber-400 pl-1.5 space-y-1">
          <div className="w-3/4 h-1.5 bg-white rounded-full" />
          <div className="w-1/2 h-1 bg-amber-400/90 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    id: 'bold', 
    name: 'Impacto',
    preview: (
      <div className="w-full h-16 bg-neutral-900 relative overflow-hidden rounded-lg mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 p-1 flex items-center justify-between">
          <div className="w-1/2 h-1.5 bg-white rounded-sm font-black" />
          <div className="w-1/4 h-1 bg-white/80 rounded-sm" />
        </div>
      </div>
    )
  },
  { 
    id: 'minimalist', 
    name: 'Clean',
    preview: (
      <div className="w-full h-16 bg-slate-100 dark:bg-zinc-800 relative overflow-hidden rounded-lg mb-2 border border-gray-200 dark:border-zinc-700">
        <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-white dark:bg-zinc-900 p-1.5 rounded shadow-sm border border-gray-100 dark:border-zinc-700 space-y-1">
          <div className="w-2/3 h-1.5 bg-slate-800 dark:bg-slate-200 rounded-full" />
          <div className="flex gap-1">
            <div className="w-3 h-1 bg-gray-300 dark:bg-zinc-600 rounded-full" />
            <div className="w-3 h-1 bg-gray-300 dark:bg-zinc-600 rounded-full" />
          </div>
        </div>
      </div>
    )
  },
  { 
    id: 'myway', 
    name: 'My Way',
    preview: (
      <div className="w-full h-16 bg-stone-900 relative overflow-hidden rounded-lg mb-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        <div className="absolute top-1.5 right-1.5">
          <div className="w-4 h-4 rounded-full border border-amber-400/80 bg-black/40" />
        </div>
        <div className="absolute bottom-1.5 left-1.5 right-1.5 space-y-1">
          <div className="w-2/3 h-1.5 bg-white rounded-full" />
          <div className="w-1/2 h-1 bg-amber-400 rounded-full" />
        </div>
      </div>
    )
  },
];

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {templates.map((tpl) => {
          const isSelected = selected === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className={`relative p-2.5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-orange-50/80 dark:bg-orange-950/30 border-2 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                  : 'bg-white dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700/80 hover:border-orange-300 dark:hover:border-zinc-600 hover:shadow-sm'
              }`}
            >
              {/* Badge (e.g. Recomendado) */}
              {tpl.tag && (
                <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold shadow-sm flex items-center space-x-1 z-10">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>{tpl.tag}</span>
                </span>
              )}

              {/* Selected check icon */}
              {isSelected && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center z-10 shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="w-full">
                {tpl.preview}
              </div>

              <div className="mt-1 flex items-center justify-between w-full">
                <span className={`text-xs font-bold truncate ${
                  isSelected 
                    ? 'text-orange-900 dark:text-orange-300' 
                    : 'text-gray-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400'
                }`}>
                  {tpl.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
