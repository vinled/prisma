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
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
          {logo && (
            <div className="bg-white p-3 rounded-xl max-w-[140px] max-h-[70px] flex justify-center shadow-sm">
              <img src={logo} alt="Logo" className="object-contain max-h-[46px]" />
            </div>
          )}
          {whatsapp?.trim() && (
             <div className="flex items-center text-gray-800 bg-white px-4 py-2 rounded-xl shadow-sm">
              <Phone className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
              <span className="text-base font-bold tracking-wide">{whatsapp}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className={`flex-1 w-full ${aspectRatio === 'story' ? 'p-12' : 'p-8'} bg-white flex flex-col justify-center`}>
        
        <div className="flex-1 flex flex-col justify-center">
          {details.title?.trim() && (
            <div className={`${aspectRatio === 'story' ? 'text-[14px] mb-3' : 'text-[11px] mb-2'} uppercase tracking-[1.5px] text-[#666] font-semibold`}>
              {details.title}
            </div>
          )}
          
          {locationString && (
            <div className={`flex items-center text-[#666] ${aspectRatio === 'story' ? 'mb-4' : 'mb-3'}`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-6 h-6 mr-2' : 'w-4 h-4 mr-1.5'} shrink-0`} />
              <span className={`${aspectRatio === 'story' ? 'text-xl' : 'text-[13px]'} font-medium`}>{locationString}</span>
            </div>
          )}
          
          {details.price?.trim() && (
            <div className={`${aspectRatio === 'story' ? 'text-5xl mb-8' : 'text-4xl mb-6'} font-[800] text-[#1A1A1A] tracking-tight`}>
              {details.price}
            </div>
          )}

          {/* Minimalist Stats - Flexbox inline */}
          <div className={`flex flex-wrap items-center ${aspectRatio === 'story' ? 'gap-8 text-lg mb-8' : 'gap-6 text-[13px] mb-6'} text-[#666] font-medium`}>
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className={`${aspectRatio === 'story' ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-1.5'}`} strokeWidth={2} />
                <span>{details.area} m²</span>
              </div>
            )}
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                <BedDouble className={`${aspectRatio === 'story' ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-1.5'}`} strokeWidth={2} />
                <span>{details.bedrooms} {aspectRatio === 'story' ? 'Dorms' : 'Qts'}</span>
              </div>
            )}
            {details.suites?.trim() && (
              <div className="flex items-center">
                <Bath className={`${aspectRatio === 'story' ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-1.5'}`} strokeWidth={2} />
                <span>{details.suites} {aspectRatio === 'story' ? 'Suítes' : 'Suít'}</span>
              </div>
            )}
            {details.parking?.trim() && (
              <div className="flex items-center">
                <Car className={`${aspectRatio === 'story' ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-1.5'}`} strokeWidth={2} />
                <span>{details.parking} {aspectRatio === 'story' ? 'Vagas' : 'Vagas'}</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {tagsString && (
            <div className={`text-[#666] ${aspectRatio === 'story' ? 'text-base' : 'text-[12px]'} font-normal leading-relaxed`}>
              {tagsString}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
