import React from 'react';
import { AspectRatioId } from '../types';
import { Square, Smartphone } from 'lucide-react';

interface AspectRatioSelectorProps {
  selected: AspectRatioId;
  onSelect: (id: AspectRatioId) => void;
}

export function AspectRatioSelector({ selected, onSelect }: AspectRatioSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onSelect('feed')}
        className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2.5 ${
          selected === 'feed'
            ? 'bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-500 text-orange-700 dark:text-orange-300 shadow-sm'
            : 'bg-white dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
        }`}
      >
        <Square className="w-4 h-4 stroke-[2.2]" />
        <span>Feed (3:4)</span>
      </button>
      <button
        type="button"
        onClick={() => onSelect('story')}
        className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2.5 ${
          selected === 'story'
            ? 'bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-500 text-orange-700 dark:text-orange-300 shadow-sm'
            : 'bg-white dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
        }`}
      >
        <Smartphone className="w-4 h-4 stroke-[2.2]" />
        <span>Story (9:16)</span>
      </button>
    </div>
  );
}
