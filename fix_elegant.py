import re

with open('src/templates/ElegantTemplate.tsx', 'r') as f:
    content = f.read()

# Replace the Glass Panel div
old_glass = """        <div className={`w-[70%] max-w-[320px] bg-gradient-to-b from-black/50 to-black/10 border border-white/10 rounded-[54px] ${aspectRatio === 'story' ? 'p-[32px]' : 'p-[22px]'} shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col relative`}>
          {/* inner highlight reflection */}
          <div className="absolute inset-0 rounded-[54px] ring-1 ring-inset ring-white/5 pointer-events-none" />
          
          {/* Location */}
          {locationString && (
            <div className="flex items-center justify-center text-white/90 mb-[9px] drop-shadow-md">
              <MapPin className="w-[27px] h-[27px] mr-[9px] opacity-80" />
              <span className="text-[19px] font-medium uppercase tracking-widest">{locationString}</span>
            </div>
          )}
          {/* Price */}
          {details.price?.trim() && (
            <div className="text-center font-bold text-white drop-shadow-lg mb-[9px]">
              <span className={`${aspectRatio === 'story' ? 'text-[70px]' : 'text-[59px]'} tracking-tight`}>
                {details.price}
              </span>
            </div>
          )}
          {/* Subtle horizontal divider */}
          <div className="w-full flex justify-center mb-[16px]">
            <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          {/* Features Row */}
          <div className="flex justify-center items-center flex-wrap w-full gap-x-2 gap-y-1 text-white text-[22px] drop-shadow-sm font-medium">
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className="w-[27px] h-[27px] text-white/80 mr-[9px] stroke-[2]" />
                <span>{details.area}m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                {details.area?.trim() && <span className="text-white/30 mr-[16px]">|</span>}
                <BedDouble className="w-[27px] h-[27px] text-white/80 mr-[9px] stroke-[2]" />
                <span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center">
                {(details.area?.trim() || details.bedrooms?.trim()) && <span className="text-white/30 mr-[16px]">|</span>}
                <Bath className="w-[27px] h-[27px] text-white/80 mr-[9px] stroke-[2]" />
                <span>{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}
            {details.parking?.trim() && (
              <div className="flex items-center">
                {(details.area?.trim() || details.bedrooms?.trim() || details.suites?.trim() || details.bathrooms?.trim()) && <span className="text-white/30 mr-[16px]">|</span>}
                <Car className="w-[27px] h-[27px] text-white/80 mr-[9px] stroke-[2]" />
                <span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          {/* Differentials */}
          {tagsString && (
            <div className="w-full flex flex-col items-center mt-[16px] pt-[16px] border-t border-white/15">
              <span className="text-[19px] text-white/90 uppercase tracking-widest font-medium drop-shadow-md text-center">
                {tagsString}
              </span>
            </div>
          )}
          {/* Property Code */}
          {details.propertyCode?.trim() && (
            <div className="w-full text-center mt-[16px]">
              <span className="text-[8px] text-white/40 tracking-wider">Cód. {details.propertyCode}</span>
            </div>
          )}
        </div>"""

new_glass = """        <div className={`w-[85%] max-w-[600px] bg-black/60 backdrop-blur-md border border-white/20 rounded-[48px] ${aspectRatio === 'story' ? 'p-[64px]' : 'p-[48px]'} shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col relative gap-[24px]`}>
          {/* inner highlight reflection */}
          <div className="absolute inset-0 rounded-[48px] ring-1 ring-inset ring-white/10 pointer-events-none" />
          
          {/* Location */}
          {locationString && (
            <div className="flex items-center justify-center text-white/90 drop-shadow-md">
              <MapPin className="w-[32px] h-[32px] mr-[12px] opacity-80" />
              <span className="text-[24px] font-medium uppercase tracking-widest">{locationString}</span>
            </div>
          )}
          {/* Price - Maior Destaque */}
          {details.price?.trim() && (
            <div className="text-center font-bold text-white drop-shadow-xl">
              <span className={`${aspectRatio === 'story' ? 'text-[96px]' : 'text-[86px]'} tracking-tight`}>
                {details.price}
              </span>
            </div>
          )}
          {/* Subtle horizontal divider */}
          <div className="w-full flex justify-center">
            <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          {/* Features Row - Ícones maiores e texto mais legível */}
          <div className="flex justify-center items-center flex-wrap w-full gap-x-6 gap-y-4 text-white text-[28px] drop-shadow-md font-medium">
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className="w-[36px] h-[36px] text-white/90 mr-[12px] stroke-[2]" />
                <span>{details.area} m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                {details.area?.trim() && <span className="text-white/40 mr-[24px]">|</span>}
                <BedDouble className="w-[36px] h-[36px] text-white/90 mr-[12px] stroke-[2]" />
                <span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center">
                {(details.area?.trim() || details.bedrooms?.trim()) && <span className="text-white/40 mr-[24px]">|</span>}
                <Bath className="w-[36px] h-[36px] text-white/90 mr-[12px] stroke-[2]" />
                <span>{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}
            {details.parking?.trim() && (
              <div className="flex items-center">
                {(details.area?.trim() || details.bedrooms?.trim() || details.suites?.trim() || details.bathrooms?.trim()) && <span className="text-white/40 mr-[24px]">|</span>}
                <Car className="w-[36px] h-[36px] text-white/90 mr-[12px] stroke-[2]" />
                <span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          {/* Differentials - Texto menor e opacidade para separar do conteúdo principal */}
          {tagsString && (
            <div className="w-full flex flex-col items-center pt-[8px] border-t border-white/10">
              <span className="text-[22px] text-white/70 uppercase tracking-widest font-normal text-center drop-shadow-sm leading-relaxed">
                {tagsString}
              </span>
            </div>
          )}
          {/* Property Code */}
          {details.propertyCode?.trim() && (
            <div className="w-full text-center mt-[-10px]">
              <span className="text-[14px] text-white/40 tracking-wider">Cód. {details.propertyCode}</span>
            </div>
          )}
        </div>"""

content = content.replace(old_glass, new_glass)
with open('src/templates/ElegantTemplate.tsx', 'w') as f:
    f.write(content)
