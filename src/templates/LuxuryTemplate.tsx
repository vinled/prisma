import React from 'react';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function LuxuryTemplate({ details, image, logo, aspectRatio, brandKit }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  return (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden shadow-lg font-serif" id="post-template">
      {/* Image with dark vignette */}
      {image ? (
        <img src={image} alt="Imóvel" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      ) : (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600">
          Sem imagem
        </div>
      )}

      {/* Luxury Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

      {/* Contact Pill at top left */}
      {whatsapp?.trim() && (
        <div className="absolute top-10 left-10 flex items-center text-gray-300 font-sans bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
          <Phone className="w-5 h-5 mr-2" />
          <span className="text-base font-light tracking-widest">{whatsapp}</span>
        </div>
      )}

      {/* Content */}
      <div className={`absolute inset-0 ${aspectRatio === 'story' ? 'p-14' : 'p-10'} flex flex-col justify-end text-white`}>
        {/* Logo at the top right */}
        {logo && (
          <div className={`absolute ${aspectRatio === 'story' ? 'top-12 right-12' : 'top-10 right-10'} max-w-[160px] max-h-[80px] flex justify-end`}>
            <img src={logo} alt="Logo" className="object-contain max-h-[80px] drop-shadow-lg" />
          </div>
        )}

        <div className={`border-l-4 border-gray-400 pl-6 ${aspectRatio === 'story' ? 'mb-12' : 'mb-6'}`}>
          {details.title?.trim() && (
            <h2 className={`${aspectRatio === 'story' ? 'text-6xl mb-6' : 'text-4xl mb-2'} font-light tracking-wide drop-shadow-md`}>
              {details.title}
            </h2>
          )}
          {locationString && (
            <div className="flex items-center text-gray-300 font-light drop-shadow-md">
              <MapPin className={`${aspectRatio === 'story' ? 'w-8 h-8 mr-3' : 'w-5 h-5 mr-2'} shrink-0`} />
              <span className={`${aspectRatio === 'story' ? 'text-3xl' : 'text-lg'}`}>{locationString}</span>
            </div>
          )}
        </div>

        <div className={`flex flex-wrap items-center ${aspectRatio === 'story' ? 'gap-6 mb-12 text-xl' : 'space-x-6 mb-6 text-sm'} text-gray-300 font-light font-sans drop-shadow-md`}>
          {details.area?.trim() && (
            <div className="flex items-center space-x-2">
              <Maximize className={`${aspectRatio === 'story' ? 'w-8 h-8' : 'w-5 h-5'} text-gray-400`} />
              <span>{details.area} m²</span>
            </div>
          )}
          {details.bedrooms?.trim() && (
            <div className="flex items-center space-x-2">
              <BedDouble className={`${aspectRatio === 'story' ? 'w-8 h-8' : 'w-5 h-5'} text-gray-400`} />
              <span>{details.bedrooms} {aspectRatio === 'story' ? 'Dorms' : 'Dorms'}</span>
            </div>
          )}
          {details.suites?.trim() && (
            <div className="flex items-center space-x-2">
              <Bath className={`${aspectRatio === 'story' ? 'w-8 h-8' : 'w-5 h-5'} text-gray-400`} />
              <span>{details.suites} {aspectRatio === 'story' ? 'Suítes' : 'Suítes'}</span>
            </div>
          )}
          {details.parking?.trim() && (
            <div className="flex items-center space-x-2">
              <Car className={`${aspectRatio === 'story' ? 'w-8 h-8' : 'w-5 h-5'} text-gray-400`} />
              <span>{details.parking} {aspectRatio === 'story' ? 'Vagas' : 'Vagas'}</span>
            </div>
          )}
        </div>

        {tagsString && (
          <div className={`${aspectRatio === 'story' ? 'mb-12 text-xl line-clamp-3' : 'mb-6 text-sm line-clamp-2'} font-light text-gray-400 italic max-w-[85%] drop-shadow-md`}>
            {tagsString}
          </div>
        )}

        {details.price?.trim() && (
          <div className={`${aspectRatio === 'story' ? 'text-5xl' : 'text-3xl'} font-medium text-white tracking-widest uppercase drop-shadow-lg mt-auto`}>
            {details.price}
          </div>
        )}
      </div>
    </div>
  );
}
