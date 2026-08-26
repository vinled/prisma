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
            <Phone className="w-[27px] h-[27px] mr-[9px] opacity-90" />
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

        {/* The Glass Panel (Wide and Rectangular) */}
        <div className={`w-[92%] mx-auto bg-black/65 backdrop-blur-md border border-white/10 rounded-[48px] ${aspectRatio === 'story' ? 'p-[64px]' : 'p-[48px]'} shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col relative`}>
          {/* inner highlight reflection */}
          <div className="absolute inset-0 rounded-[48px] ring-1 ring-inset ring-white/10 pointer-events-none" />
          
          {/* Location */}
          {locationString && (
            <div className="flex items-center justify-center text-white/90 drop-shadow-md mb-[16px]">
              <MapPin className="w-[32px] h-[32px] mr-[12px] opacity-80" />
              <span className="text-[28px] font-medium uppercase tracking-widest">{locationString}</span>
            </div>
          )}
          {/* Price - Maior Destaque */}
          {details.price?.trim() && (
            <div className="text-center font-extrabold text-white drop-shadow-xl mb-[24px]">
              <span className={`${aspectRatio === 'story' ? 'text-[108px]' : 'text-[96px]'} tracking-tight`}>
                {details.price}
              </span>
            </div>
          )}
          
          {/* Features Row - Em linha única */}
          <div className="flex flex-row flex-wrap justify-center items-center w-full gap-x-[48px] gap-y-[16px] text-white text-[36px] drop-shadow-md font-medium">
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className="w-[48px] h-[48px] text-white/90 mr-[16px] stroke-[2]" />
                <span>{details.area} m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                <BedDouble className="w-[48px] h-[48px] text-white/90 mr-[16px] stroke-[2]" />
                <span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center">
                <Bath className="w-[48px] h-[48px] text-white/90 mr-[16px] stroke-[2]" />
                <span>{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}
            {details.parking?.trim() && (
              <div className="flex items-center">
                <Car className="w-[48px] h-[48px] text-white/90 mr-[16px] stroke-[2]" />
                <span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          
          {/* Differentials - Linha única centralizada */}
          {tagsString && (
            <div className="w-full flex flex-col items-center mt-[32px] pt-[24px] border-t border-white/10">
              <span className="text-[28px] text-gray-200 uppercase tracking-widest font-normal text-center drop-shadow-sm">
                {tagsString}
              </span>
            </div>
          )}
          
          {/* Property Code */}
          {details.propertyCode?.trim() && (
            <div className="w-full text-center mt-[24px]">
              <span className="text-[18px] text-white/40 tracking-wider">Cód. {details.propertyCode}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

