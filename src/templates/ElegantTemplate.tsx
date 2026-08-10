import React from 'react';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function ElegantTemplate({ details, image, logo, aspectRatio, brandKit }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  const primaryColor = brandKit?.primaryColor || '#1e3a8a';

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden shadow-lg font-sans" id="post-template">
      {/* Background Image */}
      {image ? (
        <img src={image} alt="Imóvel" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
          Sem imagem
        </div>
      )}

      {/* Gentle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent" />

      {/* Top Bar */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10">
        {logo && (
          <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl max-w-[140px] max-h-[70px] flex justify-center shadow-md">
            <img src={logo} alt="Logo" className="object-contain max-h-[46px]" />
          </div>
        )}
        {whatsapp?.trim() && (
          <div className="flex items-center text-gray-900 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md">
            <Phone className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
            <span className="text-base font-bold tracking-wide">{whatsapp}</span>
          </div>
        )}
      </div>

      {/* Card */}
      <div className={`absolute bottom-8 left-8 right-8 bg-white/30 backdrop-blur-xl border border-white/60 rounded-[2rem] ${aspectRatio === 'story' ? 'p-10' : 'p-6'} shadow-2xl`}>
        {details.title?.trim() && (
          <h2 className={`${aspectRatio === 'story' ? 'text-5xl mb-5' : 'text-2xl mb-2'} font-bold text-gray-900 leading-tight drop-shadow-[0_2px_15px_rgba(255,255,255,1)]`}>
            {details.title}
          </h2>
        )}
        
        {locationString && (
          <div className={`flex items-center text-gray-900 ${aspectRatio === 'story' ? 'mb-8' : 'mb-4'} drop-shadow-[0_2px_15px_rgba(255,255,255,1)]`}>
            <MapPin className={`${aspectRatio === 'story' ? 'w-8 h-8 mr-3' : 'w-4 h-4 mr-1'} shrink-0`} />
            <span className={`${aspectRatio === 'story' ? 'text-2xl' : 'text-sm'} font-medium`}>{locationString}</span>
          </div>
        )}

        {details.price?.trim() && (
          <div className={`${aspectRatio === 'story' ? 'text-6xl mb-10' : 'text-3xl mb-5'} font-extrabold text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]`}>
            {details.price}
          </div>
        )}

        {/* Features Row */}
        <div className={`flex justify-between items-center border-t border-gray-900/20 ${aspectRatio === 'story' ? 'pt-8 px-4' : 'pt-4 px-2'}`}>
          {details.area?.trim() && (
            <div className="flex items-center text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <Maximize className={`${aspectRatio === 'story' ? 'w-10 h-10 mr-3' : 'w-5 h-5 mr-2'}`} />
              <span className={`font-semibold ${aspectRatio === 'story' ? 'text-2xl' : 'text-sm'}`}>{details.area}m²</span>
            </div>
          )}
          {details.bedrooms?.trim() && (
            <div className="flex items-center text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <BedDouble className={`${aspectRatio === 'story' ? 'w-10 h-10 mr-3' : 'w-5 h-5 mr-2'}`} />
              <span className={`font-semibold ${aspectRatio === 'story' ? 'text-2xl' : 'text-sm'}`}>{details.bedrooms}</span>
            </div>
          )}
          {details.suites?.trim() && (
            <div className="flex items-center text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <Bath className={`${aspectRatio === 'story' ? 'w-10 h-10 mr-3' : 'w-5 h-5 mr-2'}`} />
              <span className={`font-semibold ${aspectRatio === 'story' ? 'text-2xl' : 'text-sm'}`}>{details.suites}</span>
            </div>
          )}
          {details.parking?.trim() && (
            <div className="flex items-center text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <Car className={`${aspectRatio === 'story' ? 'w-10 h-10 mr-3' : 'w-5 h-5 mr-2'}`} />
              <span className={`font-semibold ${aspectRatio === 'story' ? 'text-2xl' : 'text-sm'}`}>{details.parking}</span>
            </div>
          )}
        </div>

        {tagsString && (
          <div className={`mt-8 pt-6 border-t border-gray-900/10 ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'} text-gray-800 font-medium drop-shadow-[0_1px_5px_rgba(255,255,255,0.8)] text-center line-clamp-2`}>
            {tagsString}
          </div>
        )}
      </div>
    </div>
  );
}
