import React from 'react';
import { PropertyDetails, AspectRatioId } from '../types';

interface PriceDisplayProps {
  details: PropertyDetails;
  aspectRatio: AspectRatioId;
  baseSizeClassName?: string;
  style?: React.CSSProperties;
}

export function PriceDisplay({ details, aspectRatio, baseSizeClassName, style }: PriceDisplayProps) {
  const isLocacao = details.purpose === 'locacao';
  
  // Extract margins to apply to the outer wrapper so the inner items stay together
  let marginClasses = '';
  let textClasses = baseSizeClassName || (aspectRatio === 'story' ? 'text-[108px] font-black text-white tracking-tighter drop-shadow-md' : 'text-[86px] font-black text-white tracking-tighter drop-shadow-md');
  
  if (textClasses) {
    const marginRegex = /\b(mb-\[\d+px\]|mt-\[\d+px\]|my-\[\d+px\]|mb-\d+|mt-\d+|my-\d+)\b/g;
    const match = textClasses.match(marginRegex);
    if (match) {
      marginClasses = match.join(' ');
      textClasses = textClasses.replace(marginRegex, '').replace(/\s+/g, ' ').trim();
    }
  }

  // Determine flex alignment based on text alignment
  let alignClass = 'items-start';
  if (textClasses.includes('text-center')) {
    alignClass = 'items-center text-center';
  } else if (textClasses.includes('text-right')) {
    alignClass = 'items-end text-right';
  }

  const isLightMode = textClasses.includes('text-[#1A1A1A]') || textClasses.includes('text-black');

  // Adjusted sizes based on aspect ratio to match canvas sizes but keeping them elegant
  const subtitleClass = aspectRatio === 'story' ? 'text-[38px]' : 'text-[32px]';
  const smallTextClass = aspectRatio === 'story' ? 'text-[30px] mt-[8px]' : 'text-[30px] mt-[4px]'; // Using 30px as requested for condo/iptu

  const monthTextColor = isLightMode ? 'text-[#535353]' : 'text-white/90';
  const taxTextColor = isLightMode ? 'text-black' : 'text-white/80';
  const bulletColor = isLightMode ? 'text-black/50' : 'text-white/50';

  if (!isLocacao) {
    return (
      <div className={`whitespace-nowrap ${textClasses} ${marginClasses}`.trim()} style={style}>
        {details.price || ''}
      </div>
    );
  }

  // Locação
  return (
    <div className={`flex flex-col ${alignClass} ${marginClasses}`.trim()} style={style}>
      <div className={`whitespace-nowrap ${textClasses} flex items-baseline`}>
        {details.rent_price || 'Consulte'}
        <span className={`${subtitleClass} font-bold ${monthTextColor} ml-3 tracking-normal drop-shadow-sm font-sans`}>/mês</span>
      </div>
      
      {details.is_package ? (
        <div className={`${smallTextClass} ${taxTextColor} font-bold tracking-wide drop-shadow-sm font-sans`}>
          (Pacote: Aluguel + Taxas)
        </div>
      ) : (
        <div className={`${smallTextClass} ${taxTextColor} font-bold tracking-wide drop-shadow-sm flex items-center gap-3 font-sans`}>
          {details.condo_price && <span>Cond: {details.condo_price}</span>}
          {details.condo_price && details.iptu_price && <span className={bulletColor}>•</span>}
          {details.iptu_price && <span>IPTU: {details.iptu_price}</span>}
        </div>
      )}
    </div>
  );
}
