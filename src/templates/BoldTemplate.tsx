import React from 'react';
import { TemplateProps } from '../types';
import { BedDouble, Bath, Car, Maximize, MapPin } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function BoldTemplate({ details, image, logo, aspectRatio, brandKit, options }: TemplateProps) {
  const locationString = formatLocation(details.neighborhood, details.city, details.state);
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const topTags = allTags.slice(0, 5);
  const tagsString = topTags.join(' • ');

  const primaryColor = brandKit?.primaryColor || '#ef4444';
  
  // Options
  const imagePositionX = options?.imagePositionX ?? 50;
  const gradientOpacity = options?.gradientOpacity ?? 90;
  const opacityRatio = gradientOpacity / 100;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden shadow-lg font-sans" id="post-template">
      {/* Background Image */}
      {image ? (
        <img 
          src={image} 
          alt="Imóvel" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 saturate-150 contrast-125" 
          style={{ objectPosition: `${imagePositionX}% center` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-gray-700">
          Sem imagem
        </div>
      )}

      {/* Main Gradient (max 45% of height) */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[45%] bg-gradient-to-t from-black to-transparent pointer-events-none" 
        style={{ opacity: opacityRatio }}
      />

      {/* Top Bar with Logo & Contato */}
      <div className="absolute top-0 left-0 w-full p-[65px] flex justify-between items-start z-10">
        {logo && (
          <div className="bg-black/60 backdrop-blur-md p-[32px] rounded-[32px] border border-white/10 shadow-2xl max-w-[324px] max-h-[130px] flex items-center justify-center">
            <img src={logo} alt="Logo" className="object-contain max-h-[86px]" />
          </div>
        )}
        {whatsapp?.trim() && (
          <div 
            className="text-white font-black px-[43px] py-[27px] rounded-[27px] shadow-2xl tracking-widest text-[43px]"
            style={{ backgroundColor: primaryColor }}
          >
            {whatsapp}
          </div>
        )}
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 left-0 w-full text-white z-10">
        <div className={`${aspectRatio === 'story' ? 'px-12 pb-6' : 'px-[54px] pb-2'}`}>
          {details.title?.trim() && (
            <div className={`inline-block bg-[#FFD700] text-black rounded-[4px] uppercase font-bold drop-shadow-md mb-[22px] ${aspectRatio === 'story' ? 'px-[43px] py-[16px] text-[49px]' : 'px-[22px] py-1 text-[27px]'}`}>
              {details.title}
            </div>
          )}
          
          {details.price?.trim() && (
            <div className={`whitespace-nowrap ${aspectRatio === 'story' ? 'text-7xl mb-[32px]' : 'text-[86px] mb-[16px]'} font-[900] text-white text-left tracking-tight drop-shadow-lg`}>
              {details.price}
            </div>
          )}

          {locationString && (
            <div className={`flex items-center text-gray-200 ${aspectRatio === 'story' ? 'mb-[32px]' : 'mb-[16px]'} drop-shadow-md`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-[49px] h-[49px] mr-[22px]' : 'w-[32px] h-[32px] mr-[9px]'} shrink-0`} />
              <span className={`${aspectRatio === 'story' ? 'text-[59px]' : 'text-[27px]'} font-medium`}>{locationString}</span>
            </div>
          )}
          
          {tagsString && (
            <div className={`text-white/90 ${aspectRatio === 'story' ? 'text-[49px]' : 'text-[30px]'} font-medium drop-shadow-md leading-snug max-w-[90%] mb-[32px]`}>
              + {tagsString}
            </div>
          )}
        </div>

        {/* Features Row */}
        <div className={`flex justify-start gap-[54px] items-center ${aspectRatio === 'story' ? 'pb-12 px-12' : 'pb-6 px-[54px]'}`}>
          {details.area?.trim() && (
            <div className="flex flex-col items-start">
              <Maximize className={`${aspectRatio === 'story' ? 'w-[54px] h-[54px] mb-[16px]' : 'w-[27px] h-[27px] mb-[9px]'} text-white opacity-90`} strokeWidth={2.5} />
              <span className={`font-bold ${aspectRatio === 'story' ? 'text-[43px]' : 'text-[27px]'} drop-shadow`}>{details.area} m²</span>
            </div>
          )}
          {details.bedrooms?.trim() && (
            <div className="flex flex-col items-start">
              <BedDouble className={`${aspectRatio === 'story' ? 'w-[54px] h-[54px] mb-[16px]' : 'w-[27px] h-[27px] mb-[9px]'} text-white opacity-90`} strokeWidth={2.5} />
              <span className={`font-bold ${aspectRatio === 'story' ? 'text-[43px]' : 'text-[27px]'} drop-shadow`}>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
            </div>
          )}
          {details.suites?.trim() && (
            <div className="flex flex-col items-start">
              <Bath className={`${aspectRatio === 'story' ? 'w-[54px] h-[54px] mb-[16px]' : 'w-[27px] h-[27px] mb-[9px]'} text-white opacity-90`} strokeWidth={2.5} />
              <span className={`font-bold ${aspectRatio === 'story' ? 'text-[43px]' : 'text-[27px]'} drop-shadow`}>{details.suites} {Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}</span>
            </div>
          )}
          {details.parking?.trim() && (
            <div className="flex flex-col items-start">
              <Car className={`${aspectRatio === 'story' ? 'w-[54px] h-[54px] mb-[16px]' : 'w-[27px] h-[27px] mb-[9px]'} text-white opacity-90`} strokeWidth={2.5} />
              <span className={`font-bold ${aspectRatio === 'story' ? 'text-[43px]' : 'text-[27px]'} drop-shadow`}>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
