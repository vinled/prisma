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
            ? 'bg-blue-50 ring-2 ring-blue-600 text-blue-800 shadow-sm'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Square className="w-5 h-5" />
        <span>Feed (1:1)</span>
      </button>
      <button
        onClick={() => onSelect('story')}
        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
          selected === 'story'
            ? 'bg-blue-50 ring-2 ring-blue-600 text-blue-800 shadow-sm'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Smartphone className="w-5 h-5" />
        <span>Story (9:16)</span>
      </button>
    </div>
  );
}
