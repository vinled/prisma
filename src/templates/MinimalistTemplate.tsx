import React from 'react';
import { TemplateProps } from '../types';
import { MapPin, Phone } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function MinimalistTemplate({ details, image, logo, aspectRatio, brandKit }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  const primaryColor = brandKit?.primaryColor || '#2563eb';

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden shadow-lg font-sans flex flex-col" id="post-template">
      {/* Top Image Area */}
      <div className={`relative w-full ${aspectRatio === 'story' ? 'h-[55%]' : 'h-[60%]'} rounded-b-[40px] overflow-hidden shadow-sm shrink-0`}>
        {image ? (
          <img src={image} alt="Imóvel" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
        
        {/* Top bar with Logo and WhatsApp */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
          {logo && (
            <div className="bg-white/90 p-3 rounded-2xl max-w-[140px] max-h-[70px] flex justify-center shadow-md">
              <img src={logo} alt="Logo" className="object-contain max-h-[46px]" />
            </div>
          )}
          {whatsapp?.trim() && (
            <div className="flex items-center text-gray-800 bg-white/90 px-4 py-2 rounded-2xl shadow-md">
              <Phone className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
              <span className="text-base font-bold tracking-wide">{whatsapp}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className={`flex-1 w-full ${aspectRatio === 'story' ? 'p-12' : 'p-8'} bg-gray-50 flex flex-col justify-center`}>
        <div className="mb-auto">
          {details.title?.trim() && (
            <h2 className={`${aspectRatio === 'story' ? 'text-4xl mb-4' : 'text-2xl mb-2'} font-bold text-gray-900 leading-tight`}>
              {details.title}
            </h2>
          )}
          
          {locationString && (
            <div className={`flex items-center text-gray-500 ${aspectRatio === 'story' ? 'mb-6' : 'mb-4'}`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-7 h-7 mr-3' : 'w-5 h-5 mr-1'} shrink-0`} />
              <span className={`${aspectRatio === 'story' ? 'text-2xl' : 'text-sm'} line-clamp-2`}>{locationString}</span>
            </div>
          )}
          
          {details.price?.trim() && (
            <div 
              className={`${aspectRatio === 'story' ? 'text-5xl mb-8' : 'text-3xl mb-4'} font-extrabold break-words`}
              style={{ color: primaryColor }}
            >
              {details.price}
            </div>
          )}
        </div>

        {/* Minimalist Stats */}
        <div className="flex justify-between items-center w-full px-2 py-4 border-y border-gray-200">
          {details.area?.trim() && (
            <div className="flex flex-col items-center px-2 flex-1">
              <span className={`font-black text-gray-800 ${aspectRatio === 'story' ? 'text-4xl' : 'text-xl'}`}>{details.area}</span>
              <span className={`${aspectRatio === 'story' ? 'text-base mt-2' : 'text-xs'} text-gray-500 uppercase tracking-widest font-semibold`}>m²</span>
            </div>
          )}
          {details.area?.trim() && details.bedrooms?.trim() && <div className="h-12 w-px bg-gray-200 shrink-0"></div>}
          
          {details.bedrooms?.trim() && (
            <div className="flex flex-col items-center px-2 flex-1">
              <span className={`font-black text-gray-800 ${aspectRatio === 'story' ? 'text-4xl' : 'text-xl'}`}>{details.bedrooms}</span>
              <span className={`${aspectRatio === 'story' ? 'text-base mt-2' : 'text-xs'} text-gray-500 uppercase tracking-widest font-semibold`}>{aspectRatio === 'story' ? 'Dorms' : 'Dorm'}</span>
            </div>
          )}
          {details.bedrooms?.trim() && details.suites?.trim() && <div className="h-12 w-px bg-gray-200 shrink-0"></div>}

          {details.suites?.trim() && (
            <div className="flex flex-col items-center px-2 flex-1">
              <span className={`font-black text-gray-800 ${aspectRatio === 'story' ? 'text-4xl' : 'text-xl'}`}>{details.suites}</span>
              <span className={`${aspectRatio === 'story' ? 'text-base mt-2' : 'text-xs'} text-gray-500 uppercase tracking-widest font-semibold`}>{aspectRatio === 'story' ? 'Suítes' : 'Suít'}</span>
            </div>
          )}
          {(details.suites?.trim() || details.bedrooms?.trim()) && details.parking?.trim() && <div className="h-12 w-px bg-gray-200 shrink-0"></div>}

          {details.parking?.trim() && (
            <div className="flex flex-col items-center px-2 flex-1">
              <span className={`font-black text-gray-800 ${aspectRatio === 'story' ? 'text-4xl' : 'text-xl'}`}>{details.parking}</span>
              <span className={`${aspectRatio === 'story' ? 'text-base mt-2' : 'text-xs'} text-gray-500 uppercase tracking-widest font-semibold`}>{aspectRatio === 'story' ? 'Vagas' : 'Vaga'}</span>
            </div>
          )}
        </div>

        {tagsString && (
          <div className={`mt-6 ${aspectRatio === 'story' ? 'text-lg p-5' : 'text-xs sm:text-sm p-3'} text-gray-600 bg-white rounded-xl border border-gray-200 text-center line-clamp-2 shadow-sm font-medium`}>
            {tagsString}
          </div>
        )}
      </div>
    </div>
  );
}
