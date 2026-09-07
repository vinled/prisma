with open('src/templates/PriceDisplay.tsx', 'r') as f:
    content = f.read()

new_content = """import React from 'react';
import { PropertyDetails, AspectRatioId } from '../types';

interface PriceDisplayProps {
  details: PropertyDetails;
  aspectRatio: AspectRatioId;
  baseSizeClassName?: string;
}

export function PriceDisplay({ details, aspectRatio, baseSizeClassName }: PriceDisplayProps) {
  const isLocacao = details.purpose === 'locacao';
  
  // Extract margins to apply to the outer wrapper so the inner items stay together
  let marginClasses = '';
  let textClasses = baseSizeClassName || (aspectRatio === 'story' ? 'text-[108px] font-black text-white tracking-tighter drop-shadow-md' : 'text-[86px] font-black text-white tracking-tighter drop-shadow-md');
  
  if (textClasses) {
    const marginRegex = /\\b(mb-\\[\\d+px\\]|mt-\\[\\d+px\\]|my-\\[\\d+px\\]|mb-\\d+|mt-\\d+|my-\\d+)\\b/g;
    const match = textClasses.match(marginRegex);
    if (match) {
      marginClasses = match.join(' ');
      textClasses = textClasses.replace(marginRegex, '').replace(/\\s+/g, ' ').trim();
    }
  }

  // Adjusted sizes based on aspect ratio to match canvas sizes but keeping them elegant
  const subtitleClass = aspectRatio === 'story' ? 'text-[38px]' : 'text-[32px]';
  const smallTextClass = aspectRatio === 'story' ? 'text-[28px] mt-[8px]' : 'text-[22px] mt-[4px]';

  if (!isLocacao) {
    return (
      <div className={`whitespace-nowrap ${textClasses} ${marginClasses}`.trim()}>
        {details.price || ''}
      </div>
    );
  }

  // Locação
  return (
    <div className={`flex flex-col ${marginClasses}`.trim()}>
      <div className={`whitespace-nowrap ${textClasses} flex items-baseline`}>
        {details.rent_price || 'Consulte'}
        <span className={`${subtitleClass} font-bold text-white/90 ml-3 tracking-normal drop-shadow-sm font-sans`}>/mês</span>
      </div>
      
      {details.is_package ? (
        <div className={`${smallTextClass} text-white/80 font-normal tracking-wide drop-shadow-sm font-sans`}>
          (Pacote: Aluguel + Taxas)
        </div>
      ) : (
        <div className={`${smallTextClass} text-white/80 font-normal tracking-wide drop-shadow-sm flex items-center gap-3 font-sans`}>
          {details.condo_price && <span>Cond: {details.condo_price}</span>}
          {details.condo_price && details.iptu_price && <span className="text-white/50">•</span>}
          {details.iptu_price && <span>IPTU: {details.iptu_price}</span>}
        </div>
      )}
    </div>
  );
}
"""

with open('src/templates/PriceDisplay.tsx', 'w') as f:
    f.write(new_content)
