import React from 'react';
import { PriceDisplay } from './PriceDisplay';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, Phone, Sparkles } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function LuxuryTemplate({ details, image, logo, aspectRatio, brandKit, options, userPlan }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join('  •  ');

  // Options
  const gradientOpacity = options?.gradientOpacity ?? 50;
  const imagePositionX = options?.imagePositionX ?? 50;
  const opacityRatio = gradientOpacity / 100;

  const features = [];
  if (details.area?.trim()) features.push({ icon: Maximize, text: `${details.area} m²` });
  if (details.bedrooms?.trim()) features.push({ icon: BedDouble, text: `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}` });
  if (details.suites?.trim() || details.bathrooms?.trim()) features.push({ icon: Bath, text: `${details.suites?.trim() ? details.suites : details.bathrooms} ${details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}` });
  if (details.parking?.trim()) features.push({ icon: Car, text: `${details.parking} ${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}` });

  const isStory = aspectRatio === 'story';
  const paddingClass = isStory ? 'p-[64px]' : 'p-[48px]';
  const seloPadding = isStory ? 'px-[22px] py-[9px]' : 'px-[18px] py-[6px]';
  const seloText = isStory ? 'text-[26px]' : 'text-[20px]';
  const tituloText = isStory ? 'text-[62px]' : 'text-[50px]';
  const enderecoText = isStory ? 'text-[32px]' : 'text-[25px]';
  const iconSize = isStory ? 'w-[32px] h-[32px]' : 'w-[25px] h-[25px]';
  const featText = isStory ? 'text-[32px]' : 'text-[25px]';
  const comodsText = isStory ? 'text-[24px]' : 'text-[19px]';

  // Sombras duplas de alta densidade para contraste 100% legível até em fotos brancas
  const textShadowStyle = {
    textShadow: '0 2px 6px rgba(0, 0, 0, 0.95), 0 1px 3px rgba(0, 0, 0, 1), 0 4px 16px rgba(0, 0, 0, 0.8)'
  };

  const titleShadowStyle = {
    fontFamily: '"Playfair Display", Georgia, serif',
    textShadow: '0 3px 12px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 1), 0 6px 24px rgba(0, 0, 0, 0.8)'
  };

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden font-sans" id="post-template">
      {/* Background Image - Límpida e vibrante */}
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

      {/* GRADIENTE SUPERIOR SUAVE E CINEMATOGRÁFICO - Apenas 34% de altura, preserva totalmente a vista */}
      <div 
        className="absolute top-0 inset-x-0 h-[34%] bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none z-10" 
        style={{ opacity: opacityRatio }} 
      />

      {/* GRADIENTE INFERIOR DISCRETO PARA O PREÇO */}
      <div 
        className="absolute bottom-0 inset-x-0 h-[240px] bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10" 
        style={{ opacity: opacityRatio }} 
      />

      {/* BLOCO SUPERIOR EDITORIAL */}
      <div 
        className={`absolute top-0 inset-x-0 ${paddingClass} z-20 flex flex-col gap-[14px]`}
      >
        
        {/* Top Bar: Logo e WhatsApp */}
        <div className="flex justify-between items-center w-full mb-[4px]">
          {logo ? (
            <img 
              src={logo} 
              alt="Logo" 
              className="object-contain max-h-[64px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]" 
              style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'left center' }} 
            />
          ) : <div />}
          {whatsapp?.trim() && (
            <div className={`flex items-center text-white/95 font-medium tracking-wide bg-black/40 backdrop-blur-md border border-white/15 rounded-full ${isStory ? 'px-[22px] py-[8px] text-[22px]' : 'px-[16px] py-[6px] text-[17px]'} shadow-md`}>
              <Phone className={`${iconSize} mr-[8px] text-emerald-400 opacity-100`} />
              <span>{whatsapp}</span>
            </div>
          )}
        </div>

        {/* Linha 1: Selo e Título com Tipografia Editorial */}
        <div className="flex flex-wrap items-center gap-[12px]">
          {options?.badge && (
            <div className="inline-flex items-center justify-center shadow-lg">
              <span 
                className={`${seloPadding} ${seloText} font-black text-white uppercase tracking-widest rounded-full shadow-md whitespace-nowrap`}
                style={{
                  backgroundColor: 
                    options.badge === 'VENDIDO' ? '#dc2626' : 
                    options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                    options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                    options.badge === 'OPORTUNIDADE' ? '#2563eb' : 
                    options.badge === 'PORTEIRA FECHADA' ? '#b45309' : '#ea580c'
                }}
              >
                {options.badge}
              </span>
            </div>
          )}
          {details.porteiraFechada && options?.badge !== 'PORTEIRA FECHADA' && (
            <div className="inline-flex items-center justify-center shadow-md">
              <div className={`${seloPadding} ${seloText} font-black text-amber-950 uppercase tracking-widest rounded-full bg-gradient-to-r from-[#f1db89] via-[#faeead] to-[#e4be52] border border-[#fff6c9] flex items-center gap-[6px] shadow-sm whitespace-nowrap`}>
                <Sparkles className={`${iconSize} text-amber-900`} />
                <span>Porteira Fechada</span>
              </div>
            </div>
          )}
          <h2 
            className={`${tituloText} text-white font-bold tracking-[0.06em] uppercase m-0 leading-tight`}
            style={titleShadowStyle}
          >
            {details.title || 'ALTO PADRÃO'}
          </h2>
        </div>

        {/* Linha 2: Endereço Elegante */}
        {locationString && (
          <div 
            className={`flex items-center gap-[8px] text-white/95 font-medium tracking-wide ${enderecoText}`}
            style={textShadowStyle}
          >
            <MapPin className={`${iconSize} text-amber-300 opacity-100 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`} />
            <span>{locationString}</span>
          </div>
        )}

        {/* Linha 3: Características em Linha Editorial com Ícones Dourados */}
        {features.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px] mt-[2px]">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-[8px] ${featText} text-white font-semibold`}
                style={textShadowStyle}
              >
                <feat.icon className={`${iconSize} text-amber-300 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`} strokeWidth={2.2} /> 
                <span>{feat.text}</span>
                {idx < features.length - 1 && (
                  <span className="text-white/40 ml-[12px] select-none">•</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Linha 4: Comodidades / Tags em Dourado Champagne */}
        {tagsString && (
          <div 
            className={`text-amber-200/90 font-medium tracking-[0.16em] uppercase ${comodsText} mt-[2px]`}
            style={textShadowStyle}
          >
            {tagsString}
          </div>
        )}

      </div>

      {/* BLOCO INFERIOR (PREÇO E MARCA D'ÁGUA) */}
      <div className={`absolute bottom-0 inset-x-0 ${paddingClass} flex justify-between items-end z-20`}>
        {/* Lado Esquerdo (Preço) */}
        <PriceDisplay 
          details={details} 
          aspectRatio={aspectRatio} 
          baseSizeClassName={`font-bold ${isStory ? 'text-[104px]' : 'text-[90px]'} text-white leading-none`} 
          style={titleShadowStyle}
        />
        
        {/* Lado Direito (Código do imóvel) */}
        {details.propertyCode?.trim() && (
          <div className="flex flex-col items-end gap-[6px]">
            <div 
              className={`text-white/80 tracking-widest uppercase font-semibold ${comodsText}`}
              style={textShadowStyle}
            >
              Cód. {details.propertyCode}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
