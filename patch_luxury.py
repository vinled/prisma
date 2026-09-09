import re

with open('src/templates/LuxuryTemplate.tsx', 'r') as f:
    content = f.read()

new_content = """import React from 'react';
import { PriceDisplay } from './PriceDisplay';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function LuxuryTemplate({ details, image, logo, aspectRatio, brandKit, options, userPlan }: TemplateProps) {
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
            backgroundImage: `url("${image?.replace(/\\"/g, '')}")`, 
            backgroundSize: 'cover', 
            backgroundPosition: `${imagePositionX}% center` 
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-700">
          Sem imagem
        </div>
      )}

      {/* Gradients para Proteção de Legibilidade */}
      <div 
        className="absolute top-0 inset-x-0 h-[50%] bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none" 
        style={{ opacity: opacityRatio }} 
      />
      <div 
        className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none" 
        style={{ opacity: opacityRatio }} 
      />

      {/* Content Container */}
      <div className={`absolute inset-0 z-10 flex flex-col justify-between`}>
        
        {/* TOP SECTION */}
        <div className="flex flex-col">
          {/* Logo & WhatsApp */}
          <div className={`flex justify-between items-start w-full px-[48px] pt-[48px]`}>
            {logo ? (
              <img src={logo} alt="Logo" className="object-contain max-h-[64px] drop-shadow-md" style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'left top' }} />
            ) : <div />}
            
            {whatsapp?.trim() && (
              <div className="flex items-center text-white/90 font-sans text-[28px] font-medium tracking-widest drop-shadow-md">
                <Phone className="w-[32px] h-[32px] mr-[12px] opacity-80" />
                <span>{whatsapp}</span>
              </div>
            )}
          </div>

          {/* Reestruturação do Bloco Superior (Alinhamento e Flexbox) */}
          <div className="flex flex-col gap-[24px] px-[48px] pt-[64px] w-full relative z-10">
            {/* Linha 1: O Título e o Selo */}
            <div className="flex flex-wrap items-center gap-[24px]">
              {options?.badge && (
                <div 
                  className="bg-orange-600 px-[24px] py-[8px] text-[24px] font-bold text-white uppercase tracking-wider rounded font-sans"
                  style={{
                    backgroundColor: (
                      options.badge === 'VENDIDO' ? '#dc2626' : 
                      options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                      options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                      options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#ea580c'
                    )
                  }}
                >
                  {options.badge}
                </div>
              )}
              {details.title?.trim() && (
                <h2 className="font-serif text-[64px] text-white tracking-widest uppercase drop-shadow-md m-0 leading-none">
                  {details.title}
                </h2>
              )}
            </div>

            {/* Linha 2: Endereço */}
            {locationString && (
              <div className="text-[32px] font-medium text-white/90 drop-shadow font-sans flex items-center gap-[12px]">
                <MapPin className="w-[32px] h-[32px] opacity-80" />
                {locationString}
              </div>
            )}

            {/* Linha 3: Características */}
            {features.length > 0 && (
              <div className="flex flex-wrap items-center gap-[32px] mt-[8px]">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-[8px] text-[32px] font-medium text-white drop-shadow font-sans">
                    <feat.icon className="w-[36px] h-[36px] opacity-90" strokeWidth={2} />
                    <span>{feat.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Linha 4: Comodidades */}
            {tagsString && (
              <div className="text-[24px] text-white/70 uppercase tracking-widest drop-shadow mt-[8px] font-sans font-semibold">
                {tagsString}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Preço e Rodapé */}
        <div className="absolute bottom-0 inset-x-0 px-[48px] pb-[48px] flex justify-between items-end z-10 w-full">
          {/* Lado Esquerdo (Preço) */}
          <PriceDisplay details={details} aspectRatio={aspectRatio} baseSizeClassName="font-serif text-[96px] text-white drop-shadow-lg leading-none" />
          
          {/* Lado Direito (Cód e Marca d'água) */}
          <div className="flex flex-col items-end gap-[8px] mb-[16px]">
            {details.propertyCode?.trim() && (
              <div className="text-[24px] text-white/60 font-sans tracking-widest uppercase">
                Cód. {details.propertyCode}
              </div>
            )}
            {userPlan !== 'pro' && (
              <div className="text-[18px] text-white/40 font-sans">
                Criado com PostNaMão
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
"""

with open('src/templates/LuxuryTemplate.tsx', 'w') as f:
    f.write(new_content)
