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
  const gradientOpacity = options?.gradientOpacity ?? 80;
  const imagePositionX = options?.imagePositionX ?? 50;
  const opacityRatio = gradientOpacity / 100;

  const features = [];
  if (details.area?.trim()) features.push({ icon: Maximize, text: `${details.area} m²` });
  if (details.bedrooms?.trim()) features.push({ icon: BedDouble, text: `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}` });
  if (details.suites?.trim() || details.bathrooms?.trim()) features.push({ icon: Bath, text: `${details.suites?.trim() ? details.suites : details.bathrooms} ${details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}` });
  if (details.parking?.trim()) features.push({ icon: Car, text: `${details.parking} ${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}` });

  // Aumentando escalas para Canvas 1080x1440
  const isStory = aspectRatio === 'story';
  const paddingClass = isStory ? 'p-[64px]' : 'p-[48px]';
  const gapClass = isStory ? 'gap-[24px]' : 'gap-[16px]';
  const seloPadding = isStory ? 'px-[24px] py-[8px]' : 'px-[16px] py-[4px]';
  const seloText = isStory ? 'text-[24px]' : 'text-[16px]';
  const tituloText = isStory ? 'text-[64px]' : 'text-[48px]';
  const enderecoText = isStory ? 'text-[32px]' : 'text-[24px]';
  const iconSize = isStory ? 'w-[32px] h-[32px]' : 'w-[24px] h-[24px]';
  const featText = isStory ? 'text-[28px]' : 'text-[20px]';
  const comodsText = isStory ? 'text-[20px]' : 'text-[14px]';

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

      {/* GRADIENTE BASE PARA O PREÇO NO FUNDO */}
      <div 
        className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" 
        style={{ opacity: opacityRatio }} 
      />

      {/* BLOCO SUPERIOR EXATO COMO PEDIDO PELO USUÁRIO (Escalado para 1080px) */}
      <div 
        className={`absolute top-0 inset-x-0 ${paddingClass} z-20 flex flex-col ${gapClass} bg-gradient-to-b from-black/80 via-black/40 to-transparent`}
        style={{ opacity: opacityRatio }}
      >
        
        {/* Logo and Whatsapp if needed at the very top, before title */}
        <div className="flex justify-between items-start w-full mb-[16px]">
          {logo ? (
            <img src={logo} alt="Logo" className="object-contain max-h-[64px] drop-shadow-md" style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'left top' }} />
          ) : <div />}
          {whatsapp?.trim() && (
            <div className={`flex items-center text-white/90 font-sans font-medium tracking-widest drop-shadow-md ${enderecoText}`}>
              <Phone className={`${iconSize} mr-[12px] opacity-80`} />
              <span>{whatsapp}</span>
            </div>
          )}
        </div>

        {/* Linha 1: Selo e Título lado a lado */}
        <div className="flex flex-wrap items-center gap-[16px]">
          {/* Renderização condicional do selo */}
          {options?.badge && (
            <span 
              className={`bg-orange-600 ${seloPadding} ${seloText} font-bold text-white uppercase tracking-wider shadow-lg font-sans rounded`}
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
            </span>
          )}
          <h2 className={`font-serif ${tituloText} text-white tracking-widest uppercase drop-shadow-md m-0 leading-none`}>
            {details.title || 'ALTO PADRÃO'}
          </h2>
        </div>

        {/* Linha 2: Endereço completo sem cortes */}
        <div className={`${enderecoText} font-medium text-white/90 drop-shadow flex items-center gap-[8px] font-sans mt-[8px]`}>
          <MapPin className={`${iconSize} opacity-90`} /> {locationString}
        </div>

        {/* Linha 3: Características */}
        <div className="flex flex-wrap items-center gap-[24px] mt-[16px]">
          {features.map((feat, idx) => (
            <div key={idx} className={`flex items-center gap-[8px] ${featText} text-white drop-shadow font-semibold font-sans`}>
              <feat.icon className={`${iconSize} opacity-90`} strokeWidth={2} /> {feat.text}
            </div>
          ))}
        </div>

        {/* Linha 4: Comodidades */}
        {tagsString && (
          <div className={`${comodsText} text-white/70 uppercase tracking-widest drop-shadow mt-[8px] font-sans font-semibold`}>
            {tagsString}
          </div>
        )}

      </div>

      {/* BLOCO INFERIOR (PREÇO E MARCA D'ÁGUA) */}
      <div className={`absolute bottom-0 inset-x-0 ${paddingClass} flex justify-between items-end z-20`}>
        {/* Lado Esquerdo (Preço) */}
        <PriceDisplay details={details} aspectRatio={aspectRatio} baseSizeClassName={`font-serif ${isStory ? 'text-[108px]' : 'text-[96px]'} text-white drop-shadow-lg leading-none`} />
        
        {/* Lado Direito (Marca d'água) */}
        <div className="flex flex-col items-end gap-[8px]">
          {details.propertyCode?.trim() && (
            <div className={`text-white/60 font-sans tracking-widest uppercase ${comodsText}`}>
              Cód. {details.propertyCode}
            </div>
          )}
          {userPlan !== 'pro' && (
            <div className={`text-white/40 font-sans ${isStory ? 'text-[18px]' : 'text-[14px]'}`}>
              Criado com PostNaMão
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
"""

with open('src/templates/LuxuryTemplate.tsx', 'w') as f:
    f.write(new_content)
