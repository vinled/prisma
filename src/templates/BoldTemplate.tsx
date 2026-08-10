import React from 'react';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function BoldTemplate({ details, image, logo, aspectRatio, brandKit }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  const primaryColor = brandKit?.primaryColor || '#ef4444';

  return (
    <div className="relative w-full h-full bg-black overflow-hidden shadow-lg" id="post-template">
      {/* Background Image */}
      {image ? (
        <img src={image} alt="Imóvel" className="absolute inset-0 w-full h-full object-cover opacity-90 saturate-150 contrast-125" />
      ) : (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-gray-700">
          Sem imagem
        </div>
      )}

      {/* Extreme Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Top Bar with Logo & Contato */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-10">
        {logo && (
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl max-w-[140px] max-h-[70px] flex items-center justify-center">
            <img src={logo} alt="Logo" className="object-contain max-h-[46px]" />
          </div>
        )}
        {whatsapp?.trim() && (
          <div 
            className="text-white font-black px-5 py-3 rounded-lg shadow-2xl tracking-widest text-lg"
            style={{ backgroundColor: primaryColor }}
          >
            {whatsapp}
          </div>
        )}
      </div>

      {/* Bold Banner at Bottom */}
      <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md border-t border-white/20 text-white shadow-2xl">
        <div className={`${aspectRatio === 'story' ? 'p-12 pb-8' : 'p-6 pb-4'}`}>
          {details.title?.trim() && (
            <h2 className={`${aspectRatio === 'story' ? 'text-6xl mb-4' : 'text-3xl mb-2'} font-black uppercase italic tracking-wider drop-shadow-lg`}>
              {details.title}
            </h2>
          )}
          {locationString && (
            <div className={`flex items-center text-gray-100 ${aspectRatio === 'story' ? 'mb-6' : 'mb-3'} drop-shadow-md`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-8 h-8 mr-3' : 'w-5 h-5 mr-1'} shrink-0`} />
              <span className={`${aspectRatio === 'story' ? 'text-3xl' : 'text-lg'} font-medium`}>{locationString}</span>
            </div>
          )}
          {details.price?.trim() && (
            <div className={`${aspectRatio === 'story' ? 'text-6xl mb-6' : 'text-4xl mb-3'} font-black bg-white/10 border border-white/20 text-white inline-block px-6 py-3 rounded-xl shadow-xl backdrop-blur-sm`}>
              {details.price}
            </div>
          )}
          {tagsString && (
            <div className={`text-white/90 ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'} font-medium drop-shadow-md leading-snug max-w-[90%] mt-4`}>
              + {tagsString}
            </div>
          )}
        </div>

        {/* Features Row - Darker Glass */}
        <div className={`bg-black/30 ${aspectRatio === 'story' ? 'p-8' : 'p-4'} flex justify-around items-center border-t border-white/10`}>
          {details.area?.trim() && (
            <div className="flex flex-col items-center">
              <Maximize className={`${aspectRatio === 'story' ? 'w-10 h-10 mb-3' : 'w-6 h-6 mb-1'} text-white opacity-90`} />
              <span className={`font-bold ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'} drop-shadow`}>{details.area} m²</span>
            </div>
          )}
          {details.bedrooms?.trim() && (
            <div className="flex flex-col items-center">
              <BedDouble className={`${aspectRatio === 'story' ? 'w-10 h-10 mb-3' : 'w-6 h-6 mb-1'} text-white opacity-90`} />
              <span className={`font-bold ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'} drop-shadow`}>{details.bedrooms} Qts</span>
            </div>
          )}
          {details.suites?.trim() && (
            <div className="flex flex-col items-center">
              <Bath className={`${aspectRatio === 'story' ? 'w-10 h-10 mb-3' : 'w-6 h-6 mb-1'} text-white opacity-90`} />
              <span className={`font-bold ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'} drop-shadow`}>{details.suites} Suít</span>
            </div>
          )}
          {details.parking?.trim() && (
            <div className="flex flex-col items-center">
              <Car className={`${aspectRatio === 'story' ? 'w-10 h-10 mb-3' : 'w-6 h-6 mb-1'} text-white opacity-90`} />
              <span className={`font-bold ${aspectRatio === 'story' ? 'text-xl' : 'text-sm'} drop-shadow`}>{details.parking} Vagas</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
