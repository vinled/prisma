import re

with open('App_backup.tsx', 'r') as f:
    text = f.read()

# 1. Everything up to "2. Informações"
header_pattern = re.compile(r'^(.*?)<section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\s*<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">2\. Informações</h2>', re.DOTALL | re.MULTILINE)
m_header = header_pattern.search(text)
part1 = m_header.group(1)

# 2. Informações section
info_pattern = re.compile(r'(<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">2\. Informações</h2>.*?<PropertyForm.*?>\s*</section>)', re.DOTALL)
m_info = info_pattern.search(text)
part2 = m_info.group(1)

# 3. Estilo section. 
# We need to extract it up to the end of the `Tamanho do Logo` div block.
estilo_pattern = re.compile(r'(<section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\s*<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>.*?<label>Tamanho do Logo</label>.*?</div>\s*</div>\s*</div>)', re.DOTALL)
m_estilo = estilo_pattern.search(text)
# And manually close it!
part3 = m_estilo.group(1) + "\n              )}\n            </section>"

# 4. Smart Caption Module
smart_pattern = re.compile(r'(\{\/\* Smart Caption Module \*\/\}.*?Copiado!.*?</button>\s*</div>\s*</div>)', re.DOTALL)
m_smart = smart_pattern.search(text)
part4 = m_smart.group(1)

# 5. Mobile Form Actions
mobile_actions_pattern = re.compile(r'(\{\/\* Mobile Form Actions \*\/\}.*?Salvar\s*</button>\s*\)\}\s*</div>)', re.DOTALL)
m_mobile = mobile_actions_pattern.search(text)
part5 = m_mobile.group(1)

# 6. Preview Side Top (Header and pagination)
preview_side_top_pattern = re.compile(r'(\{\/\* Preview Side \*\/\}.*?)(?:\{\/\* The Preview Area \*\/}|\n\s*\{\/\* The Preview Area \*\/})', re.DOTALL)
m_preview_top = preview_side_top_pattern.search(text)
part6 = m_preview_top.group(1)

# 7. The Preview Area
# I'll just use the exact string I generated earlier for the preview area
part7 = """            {/* The Preview Area */}
            <div className="flex flex-1 overflow-y-auto z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center">
                <div ref={previewContainerRef} className="flex flex-1 h-full items-center justify-center w-full max-w-md mx-auto bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200 overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-full">
                  <div 
                    ref={previewRef}
                    className={`relative shadow-xl transition-all duration-300 bg-white ${aspectRatio === 'feed' ? 'aspect-[3/4]' : 'aspect-[9/16]'}`}
                    style={{ 
                      width: '1080px', 
                      height: aspectRatio === 'story' ? '1920px' : '1440px',
                      transform: `scale(${previewScale})`,
                      transformOrigin: 'center center',
                      fontSize: '16px',
                      position: 'absolute',
                      margin: 'auto'
                    }}
                  >
                    <TemplateRenderer 
                      templateId={selectedTemplate} 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={applyBrandKit ? (brandKit?.logo || null) : null}
                      aspectRatio={aspectRatio}
                      brandKit={applyBrandKit ? brandKit : undefined}
                      options={{...templateOptions, badge: seloAtivo, imagePositionX: templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50}}
                      userPlan={userPlan}
                    />
                  </div></div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <p>Adicione fotos para visualizar</p>
                  </div>
                )}
              </div>
            </div>"""

# 8. Mobile Action Group
mobile_action_group_pattern = re.compile(r'(\{\/\* Mobile Action Group \(hidden on desktop\) \*\/\}.*?Compartilhar\s*</button>\s*</div>)', re.DOTALL)
m_mobile_group = mobile_action_group_pattern.search(text)
part8 = m_mobile_group.group(1)

# 9. Everything after Mobile Action Group down to the end
tail_pattern = re.compile(r'(<footer.*)', re.DOTALL)
m_tail = tail_pattern.search(text)
part9 = """          </div>
        </div>
        </div>
      )}
  """ + m_tail.group(1)

# Assemble
new_text = f"""{part1}
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              {part2}

            {part3}

            {part4}

            {part5}
          </div>

{part6}
{part7}

            {part8}
{part9}"""

with open('src/App.tsx', 'w') as f:
    f.write(new_text)

