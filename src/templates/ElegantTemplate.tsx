import React from 'react';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function ElegantTemplate({ details, image, logo, aspectRatio, brandKit, options }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 3);
  const tagsString = topTags.join(' • ');

  // Options
  const gradientOpacity = options?.gradientOpacity ?? 60;
  const imagePositionX = options?.imagePositionX ?? 50;
  const opacityRatio = gradientOpacity / 100;

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden font-sans" id="post-template">
      {/* Background Image */}
      {image ? (
        <img 
          src={image} 
          alt="Imóvel" 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ objectPosition: `${imagePositionX}% center` }}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-gray-500">
          Sem imagem
        </div>
      )}

      {/* Gentle Gradient for Contrast (controlled by the slider) */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" 
        style={{ opacity: opacityRatio }}
      />

      {/* Top Bar (Logo and WhatsApp) */}
      <div className={`absolute ${aspectRatio === 'story' ? 'top-10 left-8 right-8' : 'top-6 left-6 right-6'} flex justify-between items-start z-10`}>
        {logo ? (
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl max-w-[140px] max-h-[70px] flex justify-center shadow-md border border-white/20">
            <img src={logo} alt="Logo" className="object-contain max-h-[46px]" />
          </div>
        ) : <div />}
        {whatsapp?.trim() && (
          <div className="flex items-center text-white drop-shadow-md bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 shadow-lg">
            <Phone className="w-3.5 h-3.5 mr-1.5 opacity-90" />
            <span className="text-sm font-semibold tracking-wide">{whatsapp}</span>
          </div>
        )}
      </div>

      {/* Main Glass Panel Area */}
      <div className={`absolute left-0 right-0 ${aspectRatio === 'story' ? 'bottom-12' : 'bottom-8'} flex flex-col items-center z-10 w-full`}>
        
        {/* Floating Tagline / OPORTUNIDADE */}
        {details.title?.trim() && (
          <div className="mb-4 bg-gradient-to-r from-black/60 to-black/40 text-white px-5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border border-white/10 shadow-lg drop-shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] skew-x-[-15deg] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {details.title}
          </div>
        )}

        {/* The Glass Panel (now without frosted glass, just a subtle gradient) */}
        <div className={`w-[70%] max-w-[320px] bg-gradient-to-b from-black/50 to-black/10 border border-white/10 rounded-3xl ${aspectRatio === 'story' ? 'p-4' : 'p-3'} shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col relative`}>
          {/* inner highlight reflection */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 pointer-events-none" />
          
          {/* Location */}
          {locationString && (
            <div className="flex items-center justify-center text-white/90 mb-1 drop-shadow-md">
              <MapPin className="w-3 h-3 mr-1 opacity-80" />
              <span className="text-[9px] font-medium uppercase tracking-widest">{locationString}</span>
            </div>
          )}

          {/* Price */}
          {details.price?.trim() && (
            <div className="text-center font-bold text-white drop-shadow-lg mb-1.5">
              <span className={`${aspectRatio === 'story' ? 'text-3xl' : 'text-2xl'} tracking-tight`}>
                {details.price}
              </span>
            </div>
          )}

          {/* Subtle horizontal divider */}
          <div className="w-full flex justify-center mb-2">
            <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Features Row */}
          <div className="flex justify-center items-center flex-wrap w-full gap-x-2 gap-y-1 text-white text-xs drop-shadow-sm font-medium">
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className="w-3.5 h-3.5 text-white/80 mr-1 stroke-[2]" />
                <span>{details.area}m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                {details.area?.trim() && <span className="text-white/30 mr-2">|</span>}
                <BedDouble className="w-3.5 h-3.5 text-white/80 mr-1 stroke-[2]" />
                <span>{details.bedrooms}</span>
              </div>
            )}

            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center">
                {(details.area?.trim() || details.bedrooms?.trim()) && <span className="text-white/30 mr-2">|</span>}
                <Bath className="w-3.5 h-3.5 text-white/80 mr-1 stroke-[2]" />
                <span>{details.suites?.trim() ? details.suites : details.bathrooms}</span>
              </div>
            )}

            {details.parking?.trim() && (
              <div className="flex items-center">
                {(details.area?.trim() || details.bedrooms?.trim() || details.suites?.trim() || details.bathrooms?.trim()) && <span className="text-white/30 mr-2">|</span>}
                <Car className="w-3.5 h-3.5 text-white/80 mr-1 stroke-[2]" />
                <span>{details.parking}</span>
              </div>
            )}
          </div>

          {/* Differentials */}
          {tagsString && (
            <div className="w-full flex flex-col items-center mt-2.5 pt-2 border-t border-white/15">
              <span className="text-[9px] text-white/90 uppercase tracking-widest font-medium drop-shadow-md text-center">
                {tagsString}
              </span>
            </div>
          )}

          {/* Property Code */}
          {details.code?.trim() && (
            <div className="w-full text-center mt-2">
              <span className="text-[8px] text-white/40 tracking-wider">Cód. {details.code}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

