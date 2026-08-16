import React from 'react';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function LuxuryTemplate({ details, image, logo, aspectRatio, brandKit, options }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  // Options
  const gradientOpacity = options?.gradientOpacity ?? 70;
  const imagePositionX = options?.imagePositionX ?? 50;
  const opacityRatio = gradientOpacity / 100;

  const features = [];
  if (details.area?.trim()) features.push({ icon: Maximize, text: `${details.area} m²` });
  if (details.bedrooms?.trim()) features.push({ icon: BedDouble, text: `${details.bedrooms} Dorm.` });
  if (details.suites?.trim() || details.bathrooms?.trim()) features.push({ icon: Bath, text: `${details.suites?.trim() ? details.suites : details.bathrooms} ${details.suites?.trim() ? 'Suítes' : 'Banh.'}` });
  if (details.parking?.trim()) features.push({ icon: Car, text: `${details.parking} Vagas` });

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden font-serif" id="post-template">
      {/* Background Image */}
      {image ? (
        <img 
          src={image} 
          alt="Imóvel" 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ objectPosition: `${imagePositionX}% center` }}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-700">
          Sem imagem
        </div>
      )}

      {/* Cinematic Gradients for Legibility (controlled by slider) */}
      {/* Top subtle gradient for Logo & Title */}
      <div 
        className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 via-black/20 to-transparent" 
        style={{ opacity: opacityRatio }} 
      />
      {/* Bottom gradient for Price & Details */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/95 via-black/50 to-transparent" 
        style={{ opacity: opacityRatio }} 
      />

      {/* Content Container */}
      <div className={`absolute inset-0 z-10 ${aspectRatio === 'story' ? 'p-12' : 'p-8'} flex flex-col justify-between`}>
        
        {/* TOP SECTION: Logo, Title, Features */}
        <div className="flex flex-col">
          {/* Logo & WhatsApp */}
          <div className="flex justify-between items-start mb-10">
            {logo ? (
              <img src={logo} alt="Logo" className="object-contain max-h-[45px] drop-shadow-md" />
            ) : <div />}
            {whatsapp?.trim() && (
              <div className="flex items-center text-white/90 font-sans text-xs font-medium tracking-widest drop-shadow-md">
                <Phone className="w-3 h-3 mr-1.5 opacity-80" />
                <span>{whatsapp}</span>
              </div>
            )}
          </div>

          {/* Title & Location */}
          <div className="flex mb-6">
            <div className="w-[1.5px] bg-white/60 mr-4 shrink-0" />
            <div className="flex flex-col justify-center">
              {details.title?.trim() && (
                <h2 className={`font-serif ${aspectRatio === 'story' ? 'text-5xl' : 'text-2xl'} text-white font-bold uppercase tracking-widest leading-tight drop-shadow-md mb-1.5`}>
                  {details.title}
                </h2>
              )}
              {locationString && (
                <div className="flex items-center text-white/90">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-90" />
                  <span className={`font-sans font-semibold tracking-wide ${aspectRatio === 'story' ? 'text-lg' : 'text-xs'}`}>{locationString}</span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className={`flex items-center flex-wrap font-sans font-semibold text-white/95 ${aspectRatio === 'story' ? 'text-lg gap-5' : 'text-xs gap-3'} mb-3`}>
              {features.map((feat, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <div className="w-[1px] h-3.5 bg-white/40" />}
                  <div className="flex items-center">
                    <feat.icon className="w-4 h-4 mr-1.5 opacity-80" strokeWidth={2} />
                    <span>{feat.text}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Differentials */}
          {tagsString && (
            <div className={`font-sans font-semibold text-white/90 ${aspectRatio === 'story' ? 'text-base' : 'text-xs'} max-w-[85%] leading-relaxed line-clamp-2`}>
              {tagsString}
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Price & Code */}
        <div className="flex flex-col w-full mt-auto">
          {details.price?.trim() && (
            <h3 className={`font-serif ${aspectRatio === 'story' ? 'text-5xl' : 'text-[32px]'} text-white font-normal drop-shadow-lg tracking-tight mb-3`}>
              {details.price}
            </h3>
          )}
          
          <div className="w-full h-[1px] bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
          
          {details.propertyCode?.trim() && (
            <div className="mt-2.5 text-white/50 font-sans text-[9px] font-medium tracking-widest uppercase">
              Cód. {details.propertyCode}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
