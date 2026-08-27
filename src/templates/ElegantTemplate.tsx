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
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ 
            backgroundImage: `url(${image})`, 
            backgroundSize: 'cover', 
            backgroundPosition: `${imagePositionX}% center` 
          }}
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
            <img src={logo} alt="Logo" className="object-contain max-h-[86px]" style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'center' }} />
          </div>
        ) : <div />}
        {whatsapp?.trim() && (
          <div className="flex items-center text-white drop-shadow-md bg-black/20 backdrop-blur-md px-[22px] py-[16px] rounded-full border border-white/10 shadow-lg">
            <Phone className="w-[27px] h-[27px] mr-[9px] opacity-90" />
            <span className="whitespace-nowrap text-[27px] font-semibold tracking-wide">{whatsapp}</span>
          </div>
        )}
      </div>

      {/* Main Glass Panel Area - Lower Third Compact */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[32px] flex flex-col items-center z-10 w-[96%] max-w-[1000px]">
        
        {/* Floating Tagline (Original) */}
        {details.title?.trim() && (
          <div className="mb-[16px] bg-gradient-to-r from-black/60 to-black/40 text-white px-[32px] py-[8px] rounded-full text-[18px] font-bold tracking-widest uppercase border border-white/10 shadow-lg drop-shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] skew-x-[-15deg] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {details.title}
          </div>
        )}

        {/* Badge "Encostado no topo do card" */}
        {options?.badge && (
          <div 
            className="self-start mb-[8px] flex items-center justify-center font-black tracking-widest text-white drop-shadow-md"
            style={{ 
              backgroundColor: (
                options.badge === 'VENDIDO' ? '#dc2626' : 
                options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#2563eb'
              ),
              borderRadius: '8px',
              fontFamily: '"Montserrat", sans-serif',
              fontSize: aspectRatio === 'story' ? '20px' : '18px',
              padding: '6px 16px',
              textTransform: 'uppercase'
            }}
          >
            {options.badge}
          </div>
        )}

        {/* The Glass Panel (Lower Third Compact) */}
        <div className={`w-full bg-black/65 backdrop-blur-md border border-white/10 rounded-[24px] ${aspectRatio === 'story' ? 'py-[24px] px-[40px]' : 'py-[16px] px-[32px]'} shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col relative gap-[8px]`}>
          {/* inner highlight reflection */}
          <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/10 pointer-events-none" />
          
          {/* Location */}
          {locationString && (
            <div className="flex items-center justify-center text-white/90 drop-shadow-sm">
              <MapPin className="w-[18px] h-[18px] mr-[8px] opacity-80" />
              <span className="text-[18px] font-medium uppercase tracking-widest">{locationString}</span>
            </div>
          )}
          
          {/* Price - Destacado mas Compacto */}
          {details.price?.trim() && (
            <div className="text-center font-extrabold text-white drop-shadow-lg">
              <span className={`${aspectRatio === 'story' ? 'text-[64px]' : 'text-[54px]'} tracking-tight leading-none`}>
                {details.price}
              </span>
            </div>
          )}
          
          {/* Features Row - Ícones e Textos Finos em Linha Única */}
          <div className="flex flex-row flex-wrap justify-center items-center w-full gap-x-[48px] gap-y-[8px] text-white text-[18px] drop-shadow-sm font-medium mt-[8px]">
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className="w-[20px] h-[20px] text-white/90 mr-[8px] stroke-[2]" />
                <span className="whitespace-nowrap">{details.area} m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                <BedDouble className="w-[20px] h-[20px] text-white/90 mr-[8px] stroke-[2]" />
                <span className="whitespace-nowrap">{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            
            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center">
                <Bath className="w-[20px] h-[20px] text-white/90 mr-[8px] stroke-[2]" />
                <span className="whitespace-nowrap">{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}
            
            {details.parking?.trim() && (
              <div className="flex items-center">
                <Car className="w-[20px] h-[20px] text-white/90 mr-[8px] stroke-[2]" />
                <span className="whitespace-nowrap">{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          
          {/* Differentials - Texto reduzido e truncado */}
          {tagsString && (
            <div className="w-full flex justify-center mt-[8px] pt-[8px] border-t border-white/10 overflow-hidden">
              <span className="text-[14px] text-gray-300 uppercase tracking-widest font-normal text-center drop-shadow-sm truncate w-full">
                {tagsString}
              </span>
            </div>
          )}
          
          {/* Footer: Property Code and Watermark */}
          <div className="flex justify-between items-center w-full mt-[12px] pt-[12px] border-t border-white/10">
            <span className="text-[16px] text-white/80 font-medium tracking-wider">
              {details.propertyCode?.trim() ? `Cód. ${details.propertyCode}` : ''}
            </span>
            <span className="text-[16px] text-white/80 font-medium tracking-wider">
              Criado com PostNaMão
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}