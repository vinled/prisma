import React from 'react';
import { TemplateProps } from '../types';
import { MapPin, Phone, Maximize, BedDouble, Bath, Car } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function MinimalistTemplate({ details, image, logo, aspectRatio, brandKit, options }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  const primaryColor = brandKit?.primaryColor || '#2563eb';
  
  // Options
  const imagePositionX = options?.imagePositionX ?? 50;

  return (
    <div className="relative w-full h-full bg-white overflow-hidden shadow-lg font-sans flex flex-col" id="post-template">
      {/* Top Image Area */}
      <div className={`relative w-full ${aspectRatio === 'story' ? 'h-[55%]' : 'h-[60%]'} overflow-hidden shrink-0`}>
        {image ? (
          <img 
            src={image} 
            alt="Imóvel" 
            className="w-full h-full object-cover" 
            style={{ objectPosition: `${imagePositionX}% center` }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
        
        {/* Top bar with Logo and WhatsApp */}
        <div className="absolute top-[65px] left-[65px] right-[65px] flex justify-between items-start">
          {logo && (
            <div className="bg-white p-[22px] rounded-[32px] max-w-[324px] max-h-[130px] flex justify-center shadow-sm">
              <img src={logo} alt="Logo" className="object-contain max-h-[86px]" />
            </div>
          )}
          {whatsapp?.trim() && (
             <div className="flex items-center text-gray-800 bg-white px-[32px] py-[16px] rounded-[32px] shadow-sm">
              <Phone className="w-[43px] h-[43px] mr-[16px]" style={{ color: primaryColor }} />
              <span className="whitespace-nowrap text-[32px] font-bold tracking-wide">{whatsapp}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className={`flex-1 w-full ${aspectRatio === 'story' ? 'p-[108px]' : 'p-[65px]'} bg-white flex flex-col justify-center`}>
        
        <div className="flex-1 flex flex-col justify-center">
          {details.title?.trim() && (
            <div className={`${aspectRatio === 'story' ? 'text-[32px] mb-[22px]' : 'text-[24px] mb-[16px]'} uppercase tracking-[1.5px] text-[#666] font-semibold`}>
              {details.title}
            </div>
          )}
          
          {locationString && (
            <div className={`flex items-center text-[#666] ${aspectRatio === 'story' ? 'mb-[32px]' : 'mb-[22px]'}`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-[49px] h-[49px] mr-[16px]' : 'w-[32px] h-[32px] mr-[9px].5'} shrink-0`} />
              <span className={`${aspectRatio === 'story' ? 'text-[49px]' : 'text-[30px]'} font-medium`}>{locationString}</span>
            </div>
          )}
          
          {details.price?.trim() && (
            <div className={`whitespace-nowrap ${aspectRatio === 'story' ? 'text-[86px] mb-[65px]' : 'text-[76px] mb-[54px]'} font-[800] text-[#1A1A1A] tracking-tight`}>
              {details.price}
            </div>
          )}

          {/* Minimalist Stats - Flexbox inline */}
          <div className={`flex flex-wrap items-center ${aspectRatio === 'story' ? 'gap-[65px] text-[43px] mb-[65px]' : 'gap-[54px] text-[30px] mb-[54px]'} text-[#666] font-medium`}>
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className={`${aspectRatio === 'story' ? 'w-[43px] h-[43px] mr-[16px]' : 'w-[32px] h-[32px] mr-[9px].5'}`} strokeWidth={2} />
                <span>{details.area} m²</span>
              </div>
            )}
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                <BedDouble className={`${aspectRatio === 'story' ? 'w-[43px] h-[43px] mr-[16px]' : 'w-[32px] h-[32px] mr-[9px].5'}`} strokeWidth={2} />
                <span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            {details.suites?.trim() && (
              <div className="flex items-center">
                <Bath className={`${aspectRatio === 'story' ? 'w-[43px] h-[43px] mr-[16px]' : 'w-[32px] h-[32px] mr-[9px].5'}`} strokeWidth={2} />
                <span>{details.suites} {Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}</span>
              </div>
            )}
            {details.parking?.trim() && (
              <div className="flex items-center">
                <Car className={`${aspectRatio === 'story' ? 'w-[43px] h-[43px] mr-[16px]' : 'w-[32px] h-[32px] mr-[9px].5'}`} strokeWidth={2} />
                <span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {tagsString && (
            <div className={`text-[#666] ${aspectRatio === 'story' ? 'text-[32px]' : 'text-[27px]'} font-normal leading-relaxed`}>
              {tagsString}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
