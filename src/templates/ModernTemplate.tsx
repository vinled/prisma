import React from 'react';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin, MessageCircle } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function ModernTemplate({ details, image, logo, aspectRatio, brandKit, options }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  const primaryColor = brandKit?.primaryColor || '#2563eb';

  const gradientOpacity = options?.gradientOpacity ?? 60;
  const imagePositionX = options?.imagePositionX ?? 50;
  const opacityRatio = gradientOpacity / 100;

  // Features prioritization
  const features = [];
  if (details.area?.trim()) features.push({ icon: Maximize, label: `${details.area} m²` });
  if (details.bedrooms?.trim()) features.push({ icon: BedDouble, label: `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}` });
  if (details.suites?.trim()) {
    features.push({ icon: Bath, label: `${details.suites} ${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}` });
  } else if (details.bathrooms?.trim()) {
    features.push({ icon: Bath, label: `${details.bathrooms} ${Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh'}` });
  }
  if (details.parking?.trim()) features.push({ icon: Car, label: `${details.parking} ${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}` });

  return (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden shadow-lg font-sans" id="post-template">
      {/* Background Image */}
      {image ? (
        <img 
          src={image} 
          alt="Imóvel" 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ objectPosition: `${imagePositionX}% center` }}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600">
          Sem imagem
        </div>
      )}

      {/* Gradients for text legibility */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent h-1/3" 
        style={{ opacity: opacityRatio * 0.7 }}
      />
      <div 
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black to-transparent h-2/3" 
        style={{ opacity: opacityRatio * 1.5 }}
      />

      {/* Top Bar: Logo & WhatsApp */}
      <div className={`absolute top-0 left-0 w-full flex justify-between items-start ${aspectRatio === 'story' ? 'p-[86px]' : 'p-[65px]'} z-10`}>
        {logo ? (
          <img src={logo} alt="Logo" className={`object-contain ${aspectRatio === 'story' ? 'max-h-[130px]' : 'max-h-[86px]'} drop-shadow-md`} />
        ) : (
          <div /> // Spacer if no logo
        )}
        
        {whatsapp?.trim() && (
          <div className={`flex items-center space-x-[16px] bg-black/30 backdrop-blur-md ${aspectRatio === 'story' ? 'px-[43px] py-[22px]' : 'px-[32px] py-[16px]'} rounded-[540px] text-white border border-white/10 shadow-sm`}>
            <MessageCircle className={`${aspectRatio === 'story' ? 'w-[43px] h-[43px]' : 'w-[32px] h-[32px]'} text-green-400`} />
            <span className={`font-medium ${aspectRatio === 'story' ? 'text-[43px]' : 'text-[27px]'} tracking-wide whitespace-nowrap`}>{whatsapp}</span>
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className={`absolute bottom-0 left-0 w-full flex flex-col ${aspectRatio === 'story' ? 'p-[86px] gap-[43px]' : 'p-[65px] gap-[32px]'} z-10`}>
        
        {/* Chamada */}
        {details.title?.trim() && (
          <div className="self-start">
            <div 
              className={`rounded-[540px] ${aspectRatio === 'story' ? 'px-[43px] py-[16px] text-[32px]' : 'px-[32px] py-[11px] text-[22px]'} font-bold tracking-widest uppercase text-white shadow-sm`}
              style={{ backgroundColor: primaryColor }}
            >
              {details.title}
            </div>
          </div>
        )}

        {/* Location & Price */}
        <div className="flex flex-col gap-[11px]">
          {locationString && (
            <div className={`flex items-center text-gray-200 ${aspectRatio === 'story' ? 'text-[49px] mb-[11px]' : 'text-[32px]'} drop-shadow-sm`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-[43px] h-[43px]' : 'w-[32px] h-[32px]'} mr-[16px] opacity-80 shrink-0`} />
              <span className="text-white font-bold tracking-wide truncate">{locationString}</span>
            </div>
          )}
          {details.price?.trim() && (
            <div className={`whitespace-nowrap ${aspectRatio === 'story' ? 'text-[108px] mb-[11px]' : 'text-[86px]'} font-black text-white tracking-tighter drop-shadow-md`}>
              {details.price}
            </div>
          )}
        </div>

        {/* Features Row */}
        {features.length > 0 && (
          <div className={`flex flex-wrap items-center ${aspectRatio === 'story' ? 'gap-[54px] mt-[11px]' : 'gap-[43px]'} text-white/95`}>
            {features.slice(0, 4).map((feat, i) => (
              <div key={i} className="flex items-center space-x-[16px]">
                <feat.icon className={`${aspectRatio === 'story' ? 'w-[54px] h-[54px]' : 'w-[43px] h-[43px]'} opacity-70`} />
                <span className={`whitespace-nowrap ${aspectRatio === 'story' ? 'text-[49px]' : 'text-[32px]'} font-medium`}>{feat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Differentials & Code */}
        <div className={`flex justify-between items-end ${aspectRatio === 'story' ? 'mt-[32px]' : 'mt-[22px]'}`}>
          {tagsString && (
            <div className={`${aspectRatio === 'story' ? 'text-[49px]' : 'text-[27px]'} font-bold text-gray-300 max-w-[75%] leading-relaxed`}>
              {tagsString}
            </div>
          )}
          
          {details.propertyCode?.trim() && (
            <div className={`${aspectRatio === 'story' ? 'text-[43px]' : 'text-[22px]'} text-white font-bold font-[Arial] tracking-wider ml-auto`}>
              Cód. {details.propertyCode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
