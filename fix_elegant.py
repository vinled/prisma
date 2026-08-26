import re

with open('src/templates/ElegantTemplate.tsx', 'r') as f:
    content = f.read()

# Replace the Glass Panel div
old_glass_regex = r"\{\/\* The Glass Panel .*?\}(.*?)\{\/\* Property Code \*\/.*?\<\/div\>\n\s*\<\/div\>"

new_glass = """{/* The Glass Panel (Wide and Rectangular) */}
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
      </div>"""

new_content = re.sub(old_glass_regex, new_glass, content, flags=re.DOTALL)

with open('src/templates/ElegantTemplate.tsx', 'w') as f:
    f.write(new_content)

print("Updates applied if lengths differ:", len(content), len(new_content))
