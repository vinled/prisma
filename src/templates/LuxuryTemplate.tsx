import React from 'react';
import { PriceDisplay } from './PriceDisplay';
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
  if (details.bedrooms?.trim()) features.push({ icon: BedDouble, text: `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}` });
  if (details.suites?.trim() || details.bathrooms?.trim()) features.push({ icon: Bath, text: `${details.suites?.trim() ? details.suites : details.bathrooms} ${details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}` });
  if (details.parking?.trim()) features.push({ icon: Car, text: `${details.parking} ${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}` });

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden font-serif" id="post-template">
      {/* Background Image */}
      {image ? (
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ 
            backgroundImage: `url("${image?.replace(/\"/g, '')}")`, 
            backgroundSize: 'cover', 
            backgroundPosition: `${imagePositionX}% center` 
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-700">
          Sem imagem
        </div>
      )}
      {/* Badge de Oportunidade/Vendido */}
      {options?.badge && (
        <div 
          className="absolute left-0 z-[15] flex items-center justify-center font-black tracking-widest text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
          style={{ 
            top: aspectRatio === 'story' ? '280px' : '200px',
            backgroundColor: (
              options.badge === 'VENDIDO' ? '#dc2626' : 
              options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
              options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
              options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#2563eb'
            ),
            borderRadius: '0 12px 12px 0',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: aspectRatio === 'story' ? '38px' : '28px',
            padding: aspectRatio === 'story' ? '16px 24px' : '12px 18px',
            textTransform: 'uppercase'
          }}
        >
          {options.badge}
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
      <div className={`absolute inset-0 z-10 ${aspectRatio === 'story' ? 'p-[108px]' : 'p-[65px]'} flex flex-col justify-between`}>
        
        {/* TOP SECTION: Logo, Title, Features */}
        <div className="flex flex-col">
          {/* Logo & WhatsApp */}
          <div className="flex justify-between items-start mb-10">
            {logo ? (
              <img src={logo} alt="Logo" className="object-contain max-h-[45px] drop-shadow-md" style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'left top' }} />
            ) : <div />}
            {whatsapp?.trim() && (
              <div className="flex items-center text-white/90 font-sans text-[22px] font-medium tracking-widest drop-shadow-md">
                <Phone className="w-[27px] h-[27px] mr-[9px] opacity-80" />
                <span>{whatsapp}</span>
              </div>
            )}
          </div>

          {/* Title & Location */}
          <div className="flex mb-[54px]">
            <div className="w-[1.5px] bg-white/60 mr-[32px] shrink-0" />
            <div className="flex flex-col justify-center">
              {details.title?.trim() && (
                <h2 className={`font-serif ${aspectRatio === 'story' ? 'text-[86px]' : 'text-[59px]'} text-white font-bold uppercase tracking-widest leading-[1.2] drop-shadow-md mb-[9px]`}>
                  {details.title}
                </h2>
              )}
              {locationString && (
                <div className="flex items-center text-white/90">
                  <MapPin className="w-[27px] h-[27px] mr-[9px] opacity-90" />
                  <span className={`font-sans font-semibold tracking-wide ${aspectRatio === 'story' ? 'text-[43px]' : 'text-[22px]'}`}>{locationString}</span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className={`flex items-center flex-wrap font-sans font-semibold text-white/95 ${aspectRatio === 'story' ? 'text-[43px] gap-[43px]' : 'text-[22px] gap-[22px]'} mb-[22px]`}>
              {features.map((feat, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <div className="w-[1px] h-[27px] bg-white/40" />}
                  <div className="flex items-center">
                    <feat.icon className="w-[32px] h-[32px] mr-[9px] opacity-80" strokeWidth={2} />
                    <span>{feat.text}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Differentials */}
          {tagsString && (
            <div className={`font-sans font-semibold text-white/90 ${aspectRatio === 'story' ? 'text-[32px]' : 'text-[22px]'} max-w-[85%] leading-relaxed line-clamp-2`}>
              {tagsString}
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Price & Code */}
        <div className="flex flex-col w-full mt-auto">
          <PriceDisplay details={details} aspectRatio={aspectRatio} baseSizeClassName={`font-serif ${aspectRatio === 'story' ? 'text-[86px]' : 'text-[76px]'} text-white font-normal drop-shadow-lg tracking-tight mb-[22px]`} />
          
          <div className="w-full h-[1px] bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
          
          {details.propertyCode?.trim() && (
            <div className="mt-[16px] text-white/50 font-sans text-[19px] font-medium tracking-widest uppercase">
              Cód. {details.propertyCode}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
