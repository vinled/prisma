import re

with open('App_backup.tsx', 'r') as f:
    text = f.read()

# 1. Everything up to the end of "2. Informações" section
info_pattern = re.compile(r'^(.*?)<section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\s*<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>', re.DOTALL | re.MULTILINE)
m_info = info_pattern.search(text)
part1 = m_info.group(1)

# 2. Find Estilo section to the end of the Smart Caption Module (we just grep everything from Estilo to the smart caption end)
# Smart caption ends with "Copiar Legenda" then </button> </div> </div>
estilo_to_caption = re.compile(r'(<section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\s*<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>.*?Copiar Legenda</>\s*<.*?/button>\s*</div>\s*</div>)', re.DOTALL)
m_estilo = estilo_to_caption.search(text)
part2 = m_estilo.group(1)

# 3. Mobile Form Actions (The "Voltar/Salvar" buttons for the form side)
mobile_actions_pattern = re.compile(r'(\{\/\* Mobile Form Actions \*\/\}.*?Salvar\s*</button>\s*\)\}\s*</div>)', re.DOTALL)
m_mobile = mobile_actions_pattern.search(text)
part3 = m_mobile.group(1)

# 4. Preview Side Top (Header and pagination)
preview_side_top_pattern = re.compile(r'(\{\/\* Preview Side \*\/\}.*?)(?:\{\/\* The Preview Area \*\/}|\n\s*\{\/\* The Preview Area \*\/})', re.DOTALL)
m_preview_top = preview_side_top_pattern.search(text)
part4 = m_preview_top.group(1)

# 5. New Preview Area
part5 = """            {/* The Preview Area */}
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

# 6. Mobile Action Group (for the preview side)
mobile_action_group_pattern = re.compile(r'(\{\/\* Mobile Action Group \(hidden on desktop\) \*\/\}.*?Compartilhar\s*</button>\s*</div>)', re.DOTALL)
m_mobile_group = mobile_action_group_pattern.search(text)
part6 = m_mobile_group.group(1)

# 7. Tail
tail_pattern = re.compile(r'(<footer.*)', re.DOTALL)
m_tail = tail_pattern.search(text)
part7 = """          </div>
        </div>
        </div>
      )}
  """ + m_tail.group(1)

# Write to file
with open('src/App.tsx', 'w') as f:
    f.write(f"""{part1}
{part2}
            {part3}
          </div>

{part4}
{part5}

            {part6}
{part7}
""")

