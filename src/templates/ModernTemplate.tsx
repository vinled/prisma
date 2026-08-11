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
  if (details.bedrooms?.trim()) features.push({ icon: BedDouble, label: `${details.bedrooms} ${aspectRatio === 'story' ? 'Dorms' : 'Dorm'}` });
  if (details.suites?.trim()) {
    features.push({ icon: Bath, label: `${details.suites} ${aspectRatio === 'story' ? 'Suítes' : 'Suíte'}` });
  } else if (details.bathrooms?.trim()) {
    features.push({ icon: Bath, label: `${details.bathrooms} ${aspectRatio === 'story' ? 'Banh' : 'Banh'}` });
  }
  if (details.parking?.trim()) features.push({ icon: Car, label: `${details.parking} ${aspectRatio === 'story' ? 'Vagas' : 'Vaga'}` });

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
      <div className={`absolute top-0 left-0 w-full flex justify-between items-start ${aspectRatio === 'story' ? 'p-10' : 'p-8'} z-10`}>
        {logo ? (
          <img src={logo} alt="Logo" className={`object-contain ${aspectRatio === 'story' ? 'max-h-[70px]' : 'max-h-[50px]'} drop-shadow-md`} />
        ) : (
          <div /> // Spacer if no logo
        )}
        
        {whatsapp?.trim() && (
          <div className={`flex items-center space-x-2 bg-black/30 backdrop-blur-md ${aspectRatio === 'story' ? 'px-5 py-2.5' : 'px-4 py-2'} rounded-full text-white border border-white/10 shadow-sm`}>
            <MessageCircle className={`${aspectRatio === 'story' ? 'w-5 h-5' : 'w-4 h-4'} text-green-400`} />
            <span className={`font-medium ${aspectRatio === 'story' ? 'text-lg' : 'text-sm'} tracking-wide`}>{whatsapp}</span>
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className={`absolute bottom-0 left-0 w-full flex flex-col ${aspectRatio === 'story' ? 'p-10 gap-5' : 'p-8 gap-4'} z-10`}>
        
        {/* Chamada */}
        {details.title?.trim() && (
          <div className="self-start">
            <div 
              className={`rounded-full ${aspectRatio === 'story' ? 'px-5 py-2 text-base' : 'px-4 py-1.5 text-xs'} font-bold tracking-widest uppercase text-white shadow-sm`}
              style={{ backgroundColor: primaryColor }}
            >
              {details.title}
            </div>
          </div>
        )}

        {/* Location & Price */}
        <div className="flex flex-col gap-1">
          {locationString && (
            <div className={`flex items-center text-gray-200 ${aspectRatio === 'story' ? 'text-xl mb-1' : 'text-base'} drop-shadow-sm`}>
              <MapPin className={`${aspectRatio === 'story' ? 'w-5 h-5' : 'w-4 h-4'} mr-2 opacity-80 shrink-0`} />
              <span className="text-white font-bold tracking-wide truncate">{locationString}</span>
            </div>
          )}
          {details.price?.trim() && (
            <div className={`${aspectRatio === 'story' ? 'text-6xl mb-1' : 'text-5xl'} font-black text-white tracking-tighter drop-shadow-md`}>
              {details.price}
            </div>
          )}
        </div>

        {/* Features Row */}
        {features.length > 0 && (
          <div className={`flex flex-wrap items-center ${aspectRatio === 'story' ? 'gap-6 mt-1' : 'gap-5'} text-white/95`}>
            {features.slice(0, 4).map((feat, i) => (
              <div key={i} className="flex items-center space-x-2">
                <feat.icon className={`${aspectRatio === 'story' ? 'w-6 h-6' : 'w-5 h-5'} opacity-70`} />
                <span className={`${aspectRatio === 'story' ? 'text-xl' : 'text-base'} font-medium`}>{feat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Differentials & Code */}
        <div className={`flex justify-between items-end ${aspectRatio === 'story' ? 'mt-3' : 'mt-2'}`}>
          {tagsString && (
            <div className={`${aspectRatio === 'story' ? 'text-xl' : 'text-sm'} font-bold text-gray-300 max-w-[75%] leading-relaxed`}>
              {tagsString}
            </div>
          )}
          
          {details.propertyCode?.trim() && (
            <div className={`${aspectRatio === 'story' ? 'text-lg' : 'text-xs'} text-white font-bold font-[Arial] tracking-wider ml-auto`}>
              Cód. {details.propertyCode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
