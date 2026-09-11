with open('App_backup.tsx', 'r') as f:
    text = f.read()

# 1. Controls Side Top
# Find "2. Informações" section end:
info_start = text.find('<PropertyForm')
info_section_end = text.find('</section>', info_start) + 10

part1 = text[:info_section_end]

# 2. Extract "Estilo" to "Smart Caption Module"
estilo_start = text.find('<section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\n              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>')
# Find the end of the smart caption module.
copiar = text.find('Copiar Legenda', estilo_start)
smart_caption_end = text.find('</div>\n            </div>', copiar) + len('</div>\n            </div>')

part2 = text[estilo_start:smart_caption_end]

# 3. Mobile Form Actions
mobile_actions_start = text.find('{/* Mobile Form Actions */}')
mobile_actions_end = text.find('</div>', mobile_actions_start) + 6

part3 = text[mobile_actions_start:mobile_actions_end]

# 4. Preview Side Header
preview_side_start = text.find('{/* Preview Side */}')
preview_area_start = text.find('{/* The Preview Area */}')
part4 = text[preview_side_start:preview_area_start]

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
            </div>
"""

# 6. Mobile Action Group for preview
mobile_action_group_start = text.find('{/* Mobile Action Group (hidden on desktop) */}')
# But we need to make sure we don't accidentally grab the stray `)} \n </section>` that we were avoiding!
# Wait, let's just grab from `{/* Mobile Action Group (hidden on desktop) */}` to the END of that block!
share_button_end = text.find('Compartilhar\n              </button>\n            </div>', mobile_action_group_start)
mobile_action_group_end = share_button_end + len('Compartilhar\n              </button>\n            </div>')
part6 = text[mobile_action_group_start:mobile_action_group_end]

# 7. closing divs
closing_divs = """
          </div>
        </div>
        </div>
      )}
  """

# 8. Footer to end
footer_start = text.find('<footer')
part7 = text[footer_start:]

new_text = f"""{part1}
            {part2}

            {part3}
          </div>

          {part4}
{part5}
            {part6}
{closing_divs}
{part7}
"""

with open('src/App.tsx', 'w') as f:
    f.write(new_text)

