import re

with open('src/templates/ElegantTemplate.tsx', 'r') as f:
    content = f.read()

old_lower_panel = """      {/* Main Glass Panel Area - Lower Third Compact */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[32px] flex flex-col items-center z-10 w-[96%] max-w-[1000px]">
        {/* The Glass Panel */}
        <div className="bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl mx-4 mb-4 px-6 py-4 flex flex-col relative w-full gap-[8px]">
          
          {/* Badge Ancorado no Topo do Card Vidro */}
          {options?.badge && (
            <div 
              className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-black px-4 py-1 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase text-white shadow-md whitespace-nowrap"
              style={{
                backgroundColor: (
                  options.badge === 'VENDIDO' ? '#dc2626' : 
                  options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                  options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                  options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#000000'
                )
              }}
            >
              {options.badge}
            </div>
          )}

          {/* Location */}
          {locationString && (
            <div className="flex items-center justify-center text-white/90 drop-shadow-sm mt-2">
              <MapPin className="w-4 h-4 mr-1 opacity-80" />
              <span className="text-sm font-medium uppercase tracking-widest">{locationString}</span>
            </div>
          )}
          
          {/* Price - Destacado mas Compacto */}
          <PriceDisplay details={details} aspectRatio={aspectRatio} baseSizeClassName="text-center font-extrabold text-white drop-shadow-lg text-4xl tracking-tight leading-none" />
          
          {/* Features Row - Ícones e Textos Finos em Linha Única */}
          <div className="flex flex-row flex-wrap justify-center items-center w-full gap-x-[24px] gap-y-[8px] text-white text-base font-medium drop-shadow-sm mt-[4px]">
            {details.area?.trim() && (
              <div className="flex items-center">
                <Maximize className="w-5 h-5 text-white/90 mr-[6px] stroke-[2]" />
                <span className="whitespace-nowrap">{details.area} m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center">
                <BedDouble className="w-5 h-5 text-white/90 mr-[6px] stroke-[2]" />
                <span className="whitespace-nowrap">{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            
            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center">
                <Bath className="w-5 h-5 text-white/90 mr-[6px] stroke-[2]" />
                <span className="whitespace-nowrap">{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}
            
            {details.parking?.trim() && (
              <div className="flex items-center">
                <Car className="w-5 h-5 text-white/90 mr-[6px] stroke-[2]" />
                <span className="whitespace-nowrap">{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          
          {/* Differentials - Wrap em vez de Truncate */}
          {allTags.length > 0 && (
            <div className="w-full flex justify-center mt-[8px] pt-[8px] border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                {allTags.map((tag, idx) => (                  <span key={idx} className="text-xs font-semibold tracking-wide uppercase text-white/80 text-center drop-shadow-sm">                    {tag}{idx < allTags.length - 1 ? <span className="ml-2">•</span> : ''}                  </span>                ))}              </div>
            </div>
          )}
          
          {/* Footer: Property Code & Watermark */}
          <div className="flex justify-between items-center w-full mt-[12px] pt-[12px] border-t border-white/10">
            <span className="text-sm text-white/80 font-medium tracking-wider">
              {details.propertyCode?.trim() ? `Cód. ${details.propertyCode}` : ''}
            </span>
            {userPlan !== 'pro' && (
              <span className="text-[10px] text-white/40 font-medium tracking-wider">
                Criado com PostNaMão
              </span>
            )}
          </div>
        </div>
      </div>"""

new_lower_panel = """      {/* Main Glass Panel Area - Left Aligned */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[40px] flex flex-col items-center z-10 w-[96%] max-w-[1000px]">
        {/* The Glass Container */}
        <div className="bg-black/40 backdrop-blur-md border border-white/20 p-[32px] rounded-[32px] w-full max-w-[940px] mx-auto flex flex-col items-start text-left relative shadow-2xl">
          
          {/* Badge Ancorado no Topo do Card Vidro (Left Aligned) */}
          {options?.badge && (
            <div 
              className="absolute -top-[18px] left-[32px] bg-black px-[24px] py-[6px] rounded-full border border-white/20 text-[16px] font-bold tracking-widest uppercase text-white shadow-md whitespace-nowrap"
              style={{
                backgroundColor: (
                  options.badge === 'VENDIDO' ? '#dc2626' : 
                  options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                  options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                  options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#000000'
                )
              }}
            >
              {options.badge}
            </div>
          )}

          {/* Linha 1: Endereço */}
          {locationString && (
            <div className="flex items-center gap-[8px] text-[20px] font-bold tracking-wider text-white/80 uppercase mt-[8px]">
              <MapPin className="w-[24px] h-[24px] opacity-80" />
              <span>{locationString}</span>
            </div>
          )}
          
          {/* Linha 2: Price */}
          <PriceDisplay details={details} aspectRatio={aspectRatio} baseSizeClassName="text-left font-black text-white text-[72px] tracking-tighter drop-shadow-lg leading-none mt-[8px] mb-[32px]" />
          
          {/* Linha 3: Características (O Grid) */}
          <div className="flex flex-wrap items-center gap-x-[40px] gap-y-[16px]">
            {details.area?.trim() && (
              <div className="flex items-center gap-[12px] text-[28px] font-bold text-white">
                <Maximize className="w-[32px] h-[32px] text-white/90 stroke-[2]" />
                <span>{details.area} m²</span>
              </div>
            )}
            
            {details.bedrooms?.trim() && (
              <div className="flex items-center gap-[12px] text-[28px] font-bold text-white">
                <BedDouble className="w-[32px] h-[32px] text-white/90 stroke-[2]" />
                <span>{details.bedrooms} {Number(details.bedrooms) !== 1 ? 'Dorms' : 'Dorm'}</span>
              </div>
            )}
            
            {(details.suites?.trim() || details.bathrooms?.trim()) && (
              <div className="flex items-center gap-[12px] text-[28px] font-bold text-white">
                <Bath className="w-[32px] h-[32px] text-white/90 stroke-[2]" />
                <span>{details.suites?.trim() ? details.suites : details.bathrooms} {details.suites?.trim() ? (Number(details.suites) !== 1 ? 'Suítes' : 'Suíte') : (Number(details.bathrooms) !== 1 ? 'Banhs' : 'Banh')}</span>
              </div>
            )}
            
            {details.parking?.trim() && (
              <div className="flex items-center gap-[12px] text-[28px] font-bold text-white">
                <Car className="w-[32px] h-[32px] text-white/90 stroke-[2]" />
                <span>{details.parking} {Number(details.parking) !== 1 ? 'Vagas' : 'Vaga'}</span>
              </div>
            )}
          </div>
          
          {/* Linha 4: Comodidades e Rodapé (Separador) */}
          <div className="w-full mt-[32px] pt-[24px] border-t border-white/20 flex flex-col gap-[12px]">
            {allTags.length > 0 && (
              <p className="text-[18px] font-semibold text-white/80 uppercase tracking-widest leading-relaxed">
                {allTags.join(' • ')}
              </p>
            )}
            
            <div className="flex justify-between items-center w-full mt-[8px]">
              <span className="text-[16px] text-white/60 font-semibold uppercase tracking-wider">
                {details.propertyCode?.trim() ? `Cód: ${details.propertyCode}` : ''}
              </span>
              {userPlan !== 'pro' && (
                <span className="text-[16px] text-white/40 font-semibold uppercase tracking-wider">
                  Criado com PostNaMão
                </span>
              )}
            </div>
          </div>

        </div>
      </div>"""

content = content.replace(old_lower_panel, new_lower_panel)

with open('src/templates/ElegantTemplate.tsx', 'w') as f:
    f.write(content)
