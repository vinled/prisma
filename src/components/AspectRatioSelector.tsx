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
        onClick={() => onSelect('feed')}
        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
          selected === 'feed'
            ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-600 text-blue-800 dark:text-blue-300 shadow-sm'
            : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
        }`}
      >
        <Square className="w-5 h-5" />
        <span>Feed (3:4)</span>
      </button>
      <button
        onClick={() => onSelect('story')}
        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
          selected === 'story'
            ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-600 text-blue-800 dark:text-blue-300 shadow-sm'
            : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
        }`}
      >
        <Smartphone className="w-5 h-5" />
        <span>Story (9:16)</span>
      </button>
    </div>
  );
}
