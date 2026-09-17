import React from 'react';
import { TemplateProps } from '../types';
import { ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { formatLocation } from '../utils/formatters';

export function MyWayTemplate({ details, image, logo, aspectRatio, brandKit, options }: TemplateProps) {
  const whatsapp = details.whatsapp || brandKit?.whatsapp;
  
  const gradientOpacity = options?.gradientOpacity ?? 60;
  const imagePositionX = options?.imagePositionX ?? 50;
  const opacityRatio = gradientOpacity / 100;
  const accentColor = '#cca36b';

  // Construct Pills
  const pills: string[] = [];
  
  // 1. Dormitórios e Suítes
  let bedSuiteText = '';
  const hasBedrooms = details.bedrooms && details.bedrooms.trim() !== '';
  const hasSuites = details.suites && details.suites.trim() !== '' && Number(details.suites) > 0;
  
  if (hasBedrooms && hasSuites) {
    bedSuiteText = `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dormitórios' : 'Dormitório'} | ${details.suites} ${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}`;
  } else if (hasBedrooms) {
    bedSuiteText = `${details.bedrooms} ${Number(details.bedrooms) !== 1 ? 'Dormitórios' : 'Dormitório'}`;
  } else if (hasSuites) {
    bedSuiteText = `${details.suites} ${Number(details.suites) !== 1 ? 'Suítes' : 'Suíte'}`;
  }
  
  if (bedSuiteText) {
    pills.push(bedSuiteText);
  }
  
  // 2. Vagas de Garagem
  if (details.parking?.trim()) {
    pills.push(`${details.parking} ${Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'} de Garagem`);
  }
  
  // 3. APENAS UM diferencial
  if (details.leisureArea) {
    pills.push('Lazer Completo');
  } else if (details.differentials && details.differentials.length > 0) {
    pills.push(details.differentials[0]);
  } else if (details.amenities && details.amenities.length > 0) {
    pills.push(details.amenities[0]);
  } else if (details.porteiraFechada) {
    pills.push('Porteira Fechada');
  } else if (details.area?.trim()) {
    pills.push(`${details.area} m²`);
  }

  const getTitleFontSize = (title: string, isStory: boolean) => {
    if (!title?.trim()) return isStory ? 108 : 96;

    const trimmed = title.trim();
    const rawLines = trimmed.split('\n').filter(l => l.trim().length > 0);
    let line1 = '';
    let line2 = '';

    if (rawLines.length >= 2) {
      line1 = rawLines[0].trim();
      line2 = rawLines.slice(1).join(' ').trim();
    } else {
      const words = trimmed.split(/\s+/);
      if (words.length > 1) {
        line1 = words[0];
        line2 = words.slice(1).join(' ');
      } else {
        line1 = trimmed;
        line2 = '';
      }
    }

    const words = trimmed.split(/\s+/);
    const maxWordLen = Math.max(...words.map(w => w.length), 0);
    const maxLineLen = Math.max(line1.length, line2.length);

    const maxFontSize = isStory ? 108 : 96;
    const minFontSize = isStory ? 34 : 30;

    // Available target width (~410px in feed, ~430px in story) to ensure safe separation from the price
    const targetWidth = isStory ? 430 : 410;

    // In font-black uppercase/heavy, each character is ~0.62 of font size
    const wordConstrainedSize = maxWordLen > 0 ? targetWidth / (maxWordLen * 0.62) : maxFontSize;
    
    // Line length constraint (average char width with spaces is ~0.56)
    const lineConstrainedSize = maxLineLen > 0 ? targetWidth / (maxLineLen * 0.56) : maxFontSize;

    const calculatedSize = Math.floor(Math.min(maxFontSize, wordConstrainedSize, lineConstrainedSize));
    return Math.max(minFontSize, calculatedSize);
  };

  const renderTitle = (title: string, isStory: boolean) => {
    if (!title?.trim()) return null;
    const fontSize = getTitleFontSize(title, isStory);
    const rawLines = title.split('\n').filter(l => l.trim().length > 0);
    
    let line1 = '';
    let line2 = '';
    if (rawLines.length >= 2) {
      line1 = rawLines[0].trim();
      line2 = rawLines.slice(1).join(' ').trim();
    } else {
      const words = title.trim().split(/\s+/);
      if (words.length > 1) {
        line1 = words[0];
        line2 = words.slice(1).join(' ');
      } else {
        line1 = title.trim();
        line2 = '';
      }
    }

    return (
      <div 
        className="flex flex-col font-black leading-[0.92] tracking-tighter w-full overflow-hidden break-words"
        style={{ fontSize: `${fontSize}px` }}
      >
        <span className="text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] break-words">{line1}</span>
        {line2 && (
          <span 
            style={{ color: accentColor }} 
            className="drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] break-words"
          >
            {line2}
          </span>
        )}
      </div>
    );
  };

  const isStory = aspectRatio === 'story';
  const pSize = isStory ? 86 : 64;

  const currentPriceRaw = details.price.replace('R$', '').trim();
  const currentPriceDisplay = currentPriceRaw.length > 0 ? currentPriceRaw : 'Sob Consulta';

  return (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden shadow-lg font-sans" id="post-template">
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
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600">
          Sem imagem
        </div>
      )}

      {/* Gradients for text legibility */}
      <div 
         className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent h-[60%]" 
         style={{ opacity: opacityRatio * 1.5 }}
      />
      <div 
         className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-[30%]" 
         style={{ opacity: opacityRatio }}
      />

      {/* Top Bar: Logo & WhatsApp */}
      <div className={`absolute top-0 left-0 w-full ${isStory ? 'p-[86px]' : 'p-[64px]'} z-10`}>
        {/* Logo Center */}
        <div className="absolute top-[64px] left-0 w-full flex justify-center items-start z-10 pointer-events-none">
          {logo && (
            <img src={logo} alt="Logo" style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'top center' }} className={`object-contain ${isStory ? 'max-h-[160px]' : 'max-h-[120px]'} drop-shadow-md`} />
          )}
        </div>

        {/* WhatsApp Left */}
        {whatsapp?.trim() && (
          <div className="absolute top-[64px] left-[64px] z-20">
            <div className={`flex items-center space-x-[16px] bg-black/40 backdrop-blur-md ${isStory ? 'px-[32px] py-[16px]' : 'px-[24px] py-[12px]'} rounded-full text-white border border-white/20 shadow-sm`}>
              <MessageCircle className={`${isStory ? 'w-[36px] h-[36px]' : 'w-[28px] h-[28px]'} text-white`} />
              <span className={`font-bold ${isStory ? 'text-[32px]' : 'text-[24px]'} tracking-wide whitespace-nowrap`}>{whatsapp}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className={`absolute bottom-0 left-0 w-full flex flex-col px-[64px] pb-[64px] z-10`}>
        
        {/* Main Info Row (Title & Pricing) */}
        <div className={`flex justify-between items-end w-full mb-[48px] gap-[24px]`}>
          
          {/* Title Left */}
          <div className="flex-1 min-w-0 pr-[8px] max-w-[52%] flex items-end">
            {renderTitle(details.title, isStory)}
          </div>

          {/* Pricing Right */}
          <div className="flex flex-col items-end text-right shrink-0">
            {options?.badge && (
              <span 
                className={`font-black uppercase tracking-[8px] mb-[16px] ${isStory ? 'text-[32px]' : 'text-[24px]'}`}
                style={{ color: accentColor }}
              >
                {options.badge}
              </span>
            )}

            {details.porteiraFechada && options?.badge !== 'PORTEIRA FECHADA' && (
              <span 
                className={`inline-flex items-center gap-[8px] font-black uppercase tracking-[3px] ${isStory ? 'text-[26px] mb-[16px] px-[24px] py-[8px]' : 'text-[18px] mb-[12px] px-[16px] py-[6px]'} rounded-full border border-[#cca36b]/80 bg-black/60 text-[#cca36b] backdrop-blur-md shadow-lg`}
              >
                <Sparkles className={`${isStory ? 'w-[22px] h-[22px]' : 'w-[16px] h-[16px]'} text-[#cca36b]`} />
                Porteira Fechada
              </span>
            )}
            
            {details.previousPrice && (
              <span className={`text-white/80 line-through font-medium tracking-[4px] uppercase mb-[8px] ${isStory ? 'text-[32px]' : 'text-[24px]'}`}>
                DE {details.previousPrice}
              </span>
            )}
            
            <div className="flex items-center gap-[12px] text-white">
              {currentPriceDisplay !== 'Sob Consulta' && (
                <div className={`flex flex-col items-end leading-none font-bold tracking-widest uppercase mt-[12px] ${isStory ? 'text-[28px]' : 'text-[22px]'}`}>
                  <span>POR</span>
                  <span>R$</span>
                </div>
              )}
              <span className={`font-black leading-none tracking-tighter ${isStory ? 'text-[112px]' : 'text-[96px]'} drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]`}>
                {currentPriceDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Pills Row */}
        {pills.length > 0 && (
          <div className={`flex flex-wrap items-center gap-[24px] mb-[48px]`}>
            {pills.map((pill, idx) => (
              <div key={idx} className={`flex items-center bg-white rounded-full ${isStory ? 'px-[32px] py-[16px]' : 'px-[24px] py-[12px]'} shadow-lg`}>
                <div 
                  className={`flex items-center justify-center rounded-full ${isStory ? 'w-[32px] h-[32px] mr-[12px]' : 'w-[24px] h-[24px] mr-[8px]'}`}
                  style={{ backgroundColor: accentColor }}
                >
                  <ChevronRight className={`text-white ${isStory ? 'w-[24px] h-[24px]' : 'w-[18px] h-[18px]'}`} strokeWidth={3} />
                </div>
                <span className={`font-black text-black ${isStory ? 'text-[28px]' : 'text-[22px]'}`}>{pill}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Line and Location */}
        <div className="w-full">
          <div className="w-full h-[2px] mb-[32px]" style={{ backgroundColor: accentColor }}></div>
          <div 
            className={`w-full text-center font-bold tracking-[8px] uppercase ${isStory ? 'text-[28px]' : 'text-[22px]'} drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}
            style={{ color: accentColor }}
          >
            {formatLocation(details.neighborhood, details.city, details.state)}
          </div>
        </div>

      </div>
    </div>
  );
}
