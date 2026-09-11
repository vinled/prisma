import re

with open('App_backup.tsx', 'r') as f:
    text = f.read()

# 1. Start up to </PropertyForm>...
info_start = text.find('<PropertyForm')
info_end = text.find('</section>', info_start) + len('</section>')
part1 = text[:info_end]

# 2. Estilo
estilo_start = text.find('<section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\n              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>')
logo_size = text.find('<label>Tamanho do Logo</label>')
div_end = text.find('</div>', logo_size)
div_end2 = text.find('</div>', div_end+1)
div_end3 = text.find('</div>', div_end2+1)  # <--- This is the one we were missing!
estilo_end = div_end3 + 6
part2 = text[estilo_start:estilo_end] + "\n              )}\n            </section>"

# 3. Smart Caption
smart_start = text.find('{/* Smart Caption Module */}')
copiar = text.find('Copiar Legenda')
btn_end = text.find('</button>', copiar)
sdiv1 = text.find('</div>', btn_end)
sdiv2 = text.find('</div>', sdiv1+1)
smart_end = sdiv2 + 6
part3 = text[smart_start:smart_end]

# 4. Mobile Form Actions
mobile_form_start = text.find('{/* Mobile Form Actions */}')
salvar = text.find('Salvar')
btn_end_salvar = text.find('</button>', salvar)
bracket_end = text.find(')}', btn_end_salvar)
mdiv1 = text.find('</div>', bracket_end)
mobile_form_end = mdiv1 + 6
part4 = text[mobile_form_start:mobile_form_end]

# 5. Preview side header
preview_start = text.find('{/* Preview Side */}')
preview_area = text.find('{/* The Preview Area */}')
part5 = text[preview_start:preview_area]

# 6. Preview Area string
part6 = """            {/* The Preview Area */}
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

# 7. Mobile action group
mobile_action_group_start = text.find('{/* Mobile Action Group (hidden on desktop) */}')
compartilhar = text.find('Compartilhar', mobile_action_group_start)
btn_end_share = text.find('</button>', compartilhar)
mdiv2 = text.find('</div>', btn_end_share)
mobile_action_group_end = mdiv2 + 6
part7 = text[mobile_action_group_start:mobile_action_group_end]

closing_divs = """
          </div>
        </div>
        </div>
      )}
"""

footer_start = text.find('<footer')
part8 = text[footer_start:]

new_text = f"""{part1}

            {part2}

            {part3}

            {part4}
          </div>

          {part5}
{part6}

            {part7}
{closing_divs}
{part8}"""

with open('src/App.tsx', 'w') as f:
    f.write(new_text)
