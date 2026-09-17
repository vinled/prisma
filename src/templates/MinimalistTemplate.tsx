import React from 'react';
import { PriceDisplay } from './PriceDisplay';
import { TemplateProps } from '../types';
import { MapPin, Phone, Maximize, BedDouble, Bath, Car, Sparkles } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function MinimalistTemplate({ details, image, logo, aspectRatio, brandKit, options }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  const primaryColor = '#2563eb';
  
  // Options
  const imagePositionX = options?.imagePositionX ?? 50;

  return (
    <div className="relative w-full h-full bg-white overflow-hidden shadow-lg font-sans flex flex-col" id="post-template">
      {/* Top Image Area */}
      <div className={`relative w-full ${aspectRatio === 'story' ? 'h-[55%]' : 'h-[60%]'} overflow-hidden shrink-0`}>
        {image ? (
          <img 
            src={image} 
            alt="Imóvel" 
            className="w-full h-full object-cover" 
            style={{ objectPosition: `${imagePositionX}% center` }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
        
        {/* Top bar with Logo and WhatsApp */}
        <div className="absolute top-[65px] left-[65px] right-[65px] flex justify-between items-start">
          {logo && (
            <div className="max-w-[324px] max-h-[130px] flex justify-start items-start">
              <img src={logo} alt="Logo" className="object-contain max-h-[86px] drop-shadow-md" style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'left top' }} />
            </div>
          )}
          {whatsapp?.trim() && (
             <div className="flex items-center text-gray-900 bg-white px-[32px] py-[16px] rounded-[32px] shadow-md border border-gray-200/90">
              <Phone className="w-[43px] h-[43px] mr-[16px]" style={{ color: primaryColor }} />
              <span className="whitespace-nowrap text-[32px] font-bold tracking-wide">{whatsapp}</span>
            </div>
          )}
        </div>

        {/* Badge in Minimalist */}
        {options?.badge && (
          <div className="absolute bottom-[32px] left-[65px] z-10">
            <div className="bg-[#1A1A1A] text-white px-[30px] py-[12px] rounded-full text-[22px] font-black tracking-widest uppercase shadow-xl">
              {options.badge}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Content Area */}
      <div className={`flex-1 w-full ${aspectRatio === 'story' ? 'p-[108px]' : 'p-[65px]'} bg-white flex flex-col justify-center`}>
        
        <div className="flex-1 flex flex-col justify-center">
          {(details.title?.trim() || (details.porteiraFechada && options?.badge !== 'PORTEIRA FECHADA')) && (
            <div className={`flex items-center justify-between gap-[16px] ${aspectRatio === 'story' ? 'mb-[24px]' : 'mb-[16px]'}`}>
              {details.title?.trim() ? (
                <div className={`${aspectRatio === 'story' ? 'text-[36px]' : 'text-[28px]'} uppercase tracking-[1.5px] text-zinc-800 font-bold truncate`}>
                  {details.title}
                </div>
              ) : <div />}
              
              {details.porteiraFechada && options?.badge !== 'PORTEIRA FECHADA' && (
                <div className={`bg-[#1A1A1A] text-white ${aspectRatio === 'story' ? 'px-[28px] py-[10px] text-[22px]' : 'px-[22px] py-[8px] text-[17px]'} rounded-full font-black tracking-widest uppercase whitespace-nowrap shrink-0 flex items-center gap-[8px] shadow-md`}>
                  <Sparkles className={`${aspectRatio === 'story' ? 'w-[20px] h-[20px]' : 'w-[16px] h-[16px]'} text-amber-400`} />
                  <span>Porteira Fechada</span>
                </div>
              )}
            </div>
          )}
          
          {locationString && (
            <div className={`flex items-center text-zinc-900 ${aspectRatio === 'story' ? 'mb-[32px]' : 'mb-[22px]'}`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-[49px] h-[49px] mr-[16px]' : 'w-[36px] h-[36px] mr-[10px]'} text-zinc-800 shrink-0`} />
              <span className={`${aspectRatio === 'story' ? 'text-[52px]' : 'text-[34px]'} font-bold tracking-tight`}>{locationString}</span>
            </div>
          )}
          
          <PriceDisplay details={details} aspectRatio={aspectRatio} baseSizeClassName={`whitespace-nowrap ${aspectRatio === 'story' ? 'text-[96px] mb-[65px]' : 'text-[82px] mb-[54px]'} font-[900] text-[#111827] tracking-tight`} />

          {/* Minimalist Stats - Flexbox inline */}
          <div className={`flex flex-wrap items-center ${aspectRatio === 'story' ? 'gap-[65px] text-[46px] mb-[65px]' : 'gap-[54px] text-[32px] mb-[54px]'} text-zinc-800 font-medium`}>
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className={`${aspectRatio === 'story' ? 'w-[46px] h-[46px] mr-[16px]' : 'w-[34px] h-[34px] mr-[10px]'} text-zinc-900`} strokeWidth={2.5} />
                <span className="font-extrabold">{details.area} m²</span>
              </div>
            )}
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                <BedDouble className={`${aspectRatio === 'story' ? 'w-[46px] h-[46px] mr-[16px]' : 'w-[34px] h-[34px] mr-[10px]'} text-zinc-900`} strokeWidth={2.5} />
                <span className="font-extrabold">{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            {details.suites?.trim() && (
              <div className="flex items-center">
                <Bath className={`${aspectRatio === 'story' ? 'w-[46px] h-[46px] mr-[16px]' : 'w-[34px] h-[34px] mr-[10px]'} text-zinc-900`} strokeWidth={2.5} />
                <span className="font-extrabold">{details.suites} {Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}</span>
              </div>
            )}
            {details.parking?.trim() && (
              <div className="flex items-center">
                <Car className={`${aspectRatio === 'story' ? 'w-[46px] h-[46px] mr-[16px]' : 'w-[34px] h-[34px] mr-[10px]'} text-zinc-900`} strokeWidth={2.5} />
                <span className="font-extrabold">{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {tagsString && (
            <div className={`text-zinc-600 ${aspectRatio === 'story' ? 'text-[36px]' : 'text-[28px]'} font-semibold leading-relaxed`}>
              {tagsString}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
