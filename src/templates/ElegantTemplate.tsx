import React from 'react';
import { PriceDisplay } from './PriceDisplay';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function ElegantTemplate({ details, image, logo, aspectRatio, brandKit, options, userPlan }: TemplateProps) {
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
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ 
            backgroundImage: `url("${image?.replace(/\"/g, '')}")`, 
            backgroundSize: 'cover', 
            backgroundPosition: `${imagePositionX}% center` 
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-gray-500">
          Sem imagem
        </div>
      )}

      {/* Top and Bottom Gradients */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" style={{ opacity: opacityRatio }} />
      <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" style={{ opacity: opacityRatio }} />

      {/* Top Bar (Logo and WhatsApp) */}
      <div className={`absolute ${aspectRatio === 'story' ? 'top-10 left-[65px] right-[65px]' : 'top-[49px] left-[49px] right-[49px]'} flex justify-between items-start z-10`}>
        {logo ? (
          <div className="max-w-[324px] max-h-[130px] flex justify-start items-start">
            <img src={logo} alt="Logo" className="object-contain max-h-[86px] drop-shadow-md" style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'left top' }} />
          </div>
        ) : <div />}
        
        {whatsapp?.trim() && (
          <div className="flex items-center text-white drop-shadow-md">
            <Phone className="w-[27px] h-[27px] mr-[9px] opacity-90 drop-shadow-md" />
            <span className="whitespace-nowrap text-[27px] font-semibold tracking-wide drop-shadow-md">{whatsapp}</span>
          </div>
        )}
      </div>

      {/* Main Glass Panel Area - Left Aligned */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[40px] flex flex-col items-center z-10 w-[96%] max-w-[1000px]">
        {/* The Glass Container */}
        <div className="bg-black/40 backdrop-blur-md border border-white/20 p-[32px] rounded-[32px] w-full max-w-[940px] mx-auto flex flex-col items-start text-left relative shadow-2xl">
          
          {/* Badge Ancorado no Topo do Card Vidro (Left Aligned) */}
          {options?.badge && (
            <div className="absolute -top-[18px] left-[32px] inline-flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <rect 
                  width="100%" 
                  height="100%" 
                  rx="999" 
                  fill={
                    options.badge === 'VENDIDO' ? '#dc2626' : 
                    options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                    options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                    options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#000000'
                  }
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
              </svg>
              <span className="relative z-10 px-[24px] py-[6px] text-[16px] font-bold tracking-widest uppercase text-white whitespace-nowrap">
                {options.badge}
              </span>
            </div>
          )}

          {/* Linha 1: Endereço */}
          {locationString && (
            <div className="flex items-center gap-[8px] text-[20px] font-bold tracking-wider text-white/80 uppercase mt-[8px]">
              <MapPin className="w-[24px] h-[24px] opacity-80" />
              <span>{locationString}</span>
            </div>
          )}
          
          {/* Linha 2: Price */}
          <PriceDisplay details={details} aspectRatio={aspectRatio} baseSizeClassName="text-left font-black text-white text-[72px] tracking-tighter drop-shadow-lg leading-none mt-[8px] mb-[32px]" />
          
          {/* Linha 3: Características (O Grid) */}
          <div className="flex flex-wrap items-center gap-x-[40px] gap-y-[16px]">
            {details.area?.trim() && (
              <div className="flex items-center gap-[12px] text-[28px] font-bold text-white">
                <Maximize className="w-[32px] h-[32px] text-white/90 stroke-[2]" />
                <span>{details.area} m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center gap-[12px] text-[28px] font-bold text-white">
                <BedDouble className="w-[32px] h-[32px] text-white/90 stroke-[2]" />
                <span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            
            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center gap-[12px] text-[28px] font-bold text-white">
                <Bath className="w-[32px] h-[32px] text-white/90 stroke-[2]" />
                <span>{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}
            
            {details.parking?.trim() && (
              <div className="flex items-center gap-[12px] text-[28px] font-bold text-white">
                <Car className="w-[32px] h-[32px] text-white/90 stroke-[2]" />
                <span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          
          {/* Linha 4: Comodidades e Rodapé (Separador) */}
          <div className="w-full mt-[32px] pt-[24px] border-t border-white/20 flex flex-col gap-[12px]">
            {allTags.length > 0 && (
              <p className="text-[18px] font-semibold text-white/80 uppercase tracking-widest leading-relaxed">
                {allTags.join(' • ')}
              </p>
            )}
            
            <div className="flex justify-between items-center w-full mt-[8px]">
              <span className="text-[16px] text-white/60 font-semibold uppercase tracking-wider">
                {details.propertyCode?.trim() ? `Cód: ${details.propertyCode}` : ''}
              </span>
              {userPlan !== 'pro' && (
                <span className="text-[16px] text-white/40 font-semibold uppercase tracking-wider">
                  Criado com PostNaMão
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
