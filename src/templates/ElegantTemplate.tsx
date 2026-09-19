import React from 'react';
import { PriceDisplay } from './PriceDisplay';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone, Sparkles } from 'lucide-react';
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
        {/* The Glass Container - Contraste blindado contra qualquer fundo */}
        <div className="bg-black/55 backdrop-blur-xl border border-white/25 p-[36px] rounded-[32px] w-full max-w-[940px] mx-auto flex flex-col items-start text-left relative shadow-2xl">
          
          {/* Badges Ancorados no Topo do Card Vidro (Left Aligned) */}
          {(options?.badge || (details.porteiraFechada && options?.badge !== 'PORTEIRA FECHADA')) && (
            <div className="absolute -top-[22px] left-[32px] flex items-center gap-[12px]">
              {options?.badge && (
                <div className="inline-flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <rect 
                      width="100%" 
                      height="100%" 
                      rx="999" 
                      fill={
                        options.badge === 'VENDIDO' ? '#dc2626' : 
                        options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                        options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                        options.badge === 'OPORTUNIDADE' ? '#2563eb' : 
                        options.badge === 'PORTEIRA FECHADA' ? '#d97706' : '#000000'
                      }
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className={`relative z-10 px-[26px] py-[8px] ${aspectRatio === 'story' ? 'text-[28px]' : 'text-[21px]'} font-black tracking-widest uppercase text-white whitespace-nowrap`}>
                    {options.badge}
                  </span>
                </div>
              )}

              {details.porteiraFechada && options?.badge !== 'PORTEIRA FECHADA' && (
                <div className={`inline-flex items-center justify-center shadow-lg bg-gradient-to-r from-amber-600 to-amber-500 border border-amber-300/50 rounded-full px-[22px] py-[8px] ${aspectRatio === 'story' ? 'text-[24px]' : 'text-[18px]'} font-black tracking-wider uppercase text-white whitespace-nowrap gap-[8px]`}>
                  <Sparkles className={`${aspectRatio === 'story' ? 'w-[20px] h-[20px]' : 'w-[16px] h-[16px]'} text-amber-200`} />
                  <span>Porteira Fechada</span>
                </div>
              )}
            </div>
          )}

          {/* Linha 1: Endereço */}
          {locationString && (
            <div className={`flex items-center gap-[10px] ${aspectRatio === 'story' ? 'text-[30px]' : 'text-[24px]'} font-bold tracking-wider text-white/95 uppercase mt-[8px] drop-shadow-sm`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-[30px] h-[30px]' : 'w-[24px] h-[24px]'} text-amber-400 opacity-100 shrink-0`} />
              <span>{locationString}</span>
            </div>
          )}
          
          {/* Linha 2: Price */}
          <PriceDisplay details={details} aspectRatio={aspectRatio} baseSizeClassName={`text-left font-black text-white ${aspectRatio === 'story' ? 'text-[96px]' : 'text-[82px]'} tracking-tighter drop-shadow-lg leading-none mt-[8px] mb-[32px]`} />
          
          {/* Linha 3: Características (O Grid) */}
          <div className="flex flex-wrap items-center gap-x-[40px] gap-y-[16px]">
            {details.area?.trim() && (
              <div className={`flex items-center gap-[12px] ${aspectRatio === 'story' ? 'text-[34px]' : 'text-[28px]'} font-bold text-white drop-shadow-sm`}>
                <Maximize className={`${aspectRatio === 'story' ? 'w-[36px] h-[36px]' : 'w-[30px] h-[30px]'} text-amber-300 stroke-[2.5]`} />
                <span>{details.area} m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className={`flex items-center gap-[12px] ${aspectRatio === 'story' ? 'text-[34px]' : 'text-[28px]'} font-bold text-white drop-shadow-sm`}>
                <BedDouble className={`${aspectRatio === 'story' ? 'w-[36px] h-[36px]' : 'w-[30px] h-[30px]'} text-amber-300 stroke-[2.5]`} />
                <span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            
            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className={`flex items-center gap-[12px] ${aspectRatio === 'story' ? 'text-[34px]' : 'text-[28px]'} font-bold text-white drop-shadow-sm`}>
                <Bath className={`${aspectRatio === 'story' ? 'w-[36px] h-[36px]' : 'w-[30px] h-[30px]'} text-amber-300 stroke-[2.5]`} />
                <span>{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}
            
            {details.parking?.trim() && (
              <div className={`flex items-center gap-[12px] ${aspectRatio === 'story' ? 'text-[34px]' : 'text-[28px]'} font-bold text-white drop-shadow-sm`}>
                <Car className={`${aspectRatio === 'story' ? 'w-[36px] h-[36px]' : 'w-[30px] h-[30px]'} text-amber-300 stroke-[2.5]`} />
                <span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          
          {/* Linha 4: Comodidades e Rodapé (Separador) */}
          <div className="w-full mt-[32px] pt-[24px] border-t border-white/20 flex flex-col gap-[12px]">
            {allTags.length > 0 && (
              <p className={`${aspectRatio === 'story' ? 'text-[26px]' : 'text-[21px]'} font-bold text-white/90 uppercase tracking-widest leading-relaxed drop-shadow-sm`}>
                {allTags.join(' • ')}
              </p>
            )}
            
            {details.propertyCode?.trim() && (
              <div className="flex items-center w-full mt-[8px]">
                <span className={`${aspectRatio === 'story' ? 'text-[22px]' : 'text-[18px]'} text-white/80 font-bold uppercase tracking-wider`}>
                  Cód: {details.propertyCode}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
