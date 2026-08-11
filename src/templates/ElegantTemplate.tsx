import React from 'react';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function ElegantTemplate({ details, image, logo, aspectRatio, brandKit, options }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  const primaryColor = brandKit?.primaryColor || '#1e3a8a';

  const gradientOpacity = options?.gradientOpacity ?? 60;
  const imagePositionX = options?.imagePositionX ?? 50;
  const opacityRatio = gradientOpacity / 100;

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden shadow-lg font-sans" id="post-template">
      {/* Background Image */}
      {image ? (
        <img 
          src={image} 
          alt="Imóvel" 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ objectPosition: `${imagePositionX}% center` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
          Sem imagem
        </div>
      )}

      {/* Gentle Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" 
        style={{ opacity: opacityRatio }}
      />

      {/* Top Bar */}
      <div className={`absolute top-8 left-8 right-8 flex justify-between items-start z-10`}>
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
      <div className={`absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md border border-white/50 rounded-[2rem] ${aspectRatio === 'story' ? 'p-6' : 'p-4'} shadow-2xl`}>
        {details.title?.trim() && (
          <h2 className={`${aspectRatio === 'story' ? 'text-4xl mb-2' : 'text-xl mb-1'} font-bold text-gray-900 leading-tight drop-shadow-[0_2px_15px_rgba(255,255,255,1)] line-clamp-2`}>
            {details.title}
          </h2>
        )}
        
        {locationString && (
          <div className={`flex items-center text-gray-900 ${aspectRatio === 'story' ? 'mb-3' : 'mb-2'} drop-shadow-[0_2px_15px_rgba(255,255,255,1)]`}>
            <MapPin className={`${aspectRatio === 'story' ? 'w-6 h-6 mr-2' : 'w-4 h-4 mr-1'} shrink-0`} />
            <span className={`${aspectRatio === 'story' ? 'text-xl' : 'text-sm'} font-medium truncate`}>{locationString}</span>
          </div>
        )}

        {details.price?.trim() && (
          <div className={`${aspectRatio === 'story' ? 'text-5xl mb-4' : 'text-3xl mb-3'} font-extrabold text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]`}>
            {details.price}
          </div>
        )}

        {/* Features Row */}
        <div className={`flex justify-between items-center border-t border-gray-900/20 ${aspectRatio === 'story' ? 'pt-4 px-2' : 'pt-3 px-1'}`}>
          {details.area?.trim() && (
            <div className="flex items-center text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <Maximize className={`${aspectRatio === 'story' ? 'w-7 h-7 mr-2' : 'w-5 h-5 mr-1.5'}`} />
              <span className={`font-semibold ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'}`}>{details.area}m²</span>
            </div>
          )}
          {details.bedrooms?.trim() && (
            <div className="flex items-center text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <BedDouble className={`${aspectRatio === 'story' ? 'w-7 h-7 mr-2' : 'w-5 h-5 mr-1.5'}`} />
              <span className={`font-semibold ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'}`}>{details.bedrooms}</span>
            </div>
          )}
          {details.suites?.trim() && (
            <div className="flex items-center text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <Bath className={`${aspectRatio === 'story' ? 'w-7 h-7 mr-2' : 'w-5 h-5 mr-1.5'}`} />
              <span className={`font-semibold ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'}`}>{details.suites}</span>
            </div>
          )}
          {details.parking?.trim() && (
            <div className="flex items-center text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <Car className={`${aspectRatio === 'story' ? 'w-7 h-7 mr-2' : 'w-5 h-5 mr-1.5'}`} />
              <span className={`font-semibold ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'}`}>{details.parking}</span>
            </div>
          )}
        </div>

        {tagsString && (
          <div className={`mt-4 pt-3 border-t border-gray-900/10 ${aspectRatio === 'story' ? 'text-lg' : 'text-xs'} text-gray-800 font-medium drop-shadow-[0_1px_5px_rgba(255,255,255,0.8)] text-center line-clamp-2`}>
            {tagsString}
          </div>
        )}
      </div>
    </div>
  );
}
