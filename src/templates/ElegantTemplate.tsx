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
      <div className={`absolute ${aspectRatio === 'story' ? 'top-10 left-[65px] right-[65px]' : 'top-[49px] left-[49px] right-[49px]'} flex justify-between items-start z-10`}>
        {logo ? (
          <div className="bg-white/20 backdrop-blur-md p-[22px] rounded-[43px] max-w-[324px] max-h-[130px] flex justify-center shadow-md border border-white/20">
            <img src={logo} alt="Logo" className="object-contain max-h-[86px]" />
          </div>
        ) : <div />}
        {whatsapp?.trim() && (
          <div className="flex items-center text-white drop-shadow-md bg-black/20 backdrop-blur-md px-[22px] py-[16px] rounded-full border border-white/10 shadow-lg">
            <Phone className="w-[27px].5 h-[27px].5 mr-[9px].5 opacity-90" />
            <span className="whitespace-nowrap text-[27px] font-semibold tracking-wide">{whatsapp}</span>
          </div>
        )}
      </div>

      {/* Main Glass Panel Area */}
      <div className={`absolute left-0 right-0 ${aspectRatio === 'story' ? 'bottom-12' : 'bottom-[65px]'} flex flex-col items-center z-10 w-full`}>
        
        {/* Floating Tagline / OPORTUNIDADE */}
        {details.title?.trim() && (
          <div className="mb-[32px] bg-gradient-to-r from-black/60 to-black/40 text-white px-[43px] py-[13px] rounded-full text-[24px] font-bold tracking-widest uppercase border border-white/10 shadow-lg drop-shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] skew-x-[-15deg] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {details.title}
          </div>
        )}

        {/* The Glass Panel (now without frosted glass, just a subtle gradient) */}
        <div className={`w-[70%] max-w-[320px] bg-gradient-to-b from-black/50 to-black/10 border border-white/10 rounded-[54px] ${aspectRatio === 'story' ? 'p-[32px]' : 'p-[22px]'} shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col relative`}>
          {/* inner highlight reflection */}
          <div className="absolute inset-0 rounded-[54px] ring-1 ring-inset ring-white/5 pointer-events-none" />
          
          {/* Location */}
          {locationString && (
            <div className="flex items-center justify-center text-white/90 mb-[9px] drop-shadow-md">
              <MapPin className="w-[27px] h-[27px] mr-[9px] opacity-80" />
              <span className="text-[19px] font-medium uppercase tracking-widest">{locationString}</span>
            </div>
          )}

          {/* Price */}
          {details.price?.trim() && (
            <div className="text-center font-bold text-white drop-shadow-lg mb-[9px].5">
              <span className={`${aspectRatio === 'story' ? 'text-[70px]' : 'text-[59px]'} tracking-tight`}>
                {details.price}
              </span>
            </div>
          )}

          {/* Subtle horizontal divider */}
          <div className="w-full flex justify-center mb-[16px]">
            <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Features Row */}
          <div className="flex justify-center items-center flex-wrap w-full gap-x-2 gap-y-1 text-white text-[22px] drop-shadow-sm font-medium">
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className="w-[27px].5 h-[27px].5 text-white/80 mr-[9px] stroke-[2]" />
                <span>{details.area}m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                {details.area?.trim() && <span className="text-white/30 mr-[16px]">|</span>}
                <BedDouble className="w-[27px].5 h-[27px].5 text-white/80 mr-[9px] stroke-[2]" />
                <span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}

            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center">
                {(details.area?.trim() || details.bedrooms?.trim()) && <span className="text-white/30 mr-[16px]">|</span>}
                <Bath className="w-[27px].5 h-[27px].5 text-white/80 mr-[9px] stroke-[2]" />
                <span>{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}

            {details.parking?.trim() && (
              <div className="flex items-center">
                {(details.area?.trim() || details.bedrooms?.trim() || details.suites?.trim() || details.bathrooms?.trim()) && <span className="text-white/30 mr-[16px]">|</span>}
                <Car className="w-[27px].5 h-[27px].5 text-white/80 mr-[9px] stroke-[2]" />
                <span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>

          {/* Differentials */}
          {tagsString && (
            <div className="w-full flex flex-col items-center mt-[16px].5 pt-[16px] border-t border-white/15">
              <span className="text-[19px] text-white/90 uppercase tracking-widest font-medium drop-shadow-md text-center">
                {tagsString}
              </span>
            </div>
          )}

          {/* Property Code */}
          {details.propertyCode?.trim() && (
            <div className="w-full text-center mt-[16px]">
              <span className="text-[8px] text-white/40 tracking-wider">Cód. {details.propertyCode}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

