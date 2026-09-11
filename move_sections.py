import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# First, extract the content that needs to be moved
# From: <section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
# Up to (but not including): </div> \n        </div> \n        </div> \n      )}
pattern = re.compile(r'(<section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\s*<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>.*?</div>\s*</div>)', re.DOTALL)

match = pattern.search(content)
if not match:
    print("Could not find sections to move!")
    exit(1)

extracted_content = match.group(1)

# Remove the extracted content from its current position
new_content = content.replace(extracted_content, '')

# Now, find where to insert it in the Controls Side.
# The controls side ends with Mobile Form Actions:
insert_target = """            {/* Mobile Form Actions */}
            <div className="flex lg:hidden gap-4 mt-8 pb-8">
              <button
                onClick={() => {
                  setActiveTab('meus_imoveis');
                  setIdEmEdicao(null);
                }}
                className="flex-1 py-3 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-xl transition-colors"
              >
                Voltar
              </button>
              {idEmEdicao && (
                <button
                  onClick={handleSaveOnly}
                  disabled={isExporting}
                  className="flex-1 py-3 bg-emerald-600 text-white hover:bg-emerald-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  Salvar
                </button>
              )}
            </div>
          </div>"""

# Insert the extracted content before the Mobile Form Actions
insertion_block = extracted_content + "\n\n" + insert_target

new_content = new_content.replace(insert_target, insertion_block)

# Also make sure the image container uses flex-1 h-full
old_image_container = """            {/* The Preview Area */}
            <div className="flex-1 overflow-y-auto sticky top-0 z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl">
                <div ref={previewContainerRef} className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200 max-h-[50vh] md:max-h-none overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative mx-auto" style={{ width: 1080 * previewScale, height: (aspectRatio === 'story' ? 1920 : 1440) * previewScale }}>"""

new_image_container = """            {/* The Preview Area */}
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
              {/* <p className="text-center text-sm text-gray-400 mt-4 absolute bottom-2 w-full">
                {images.length > 0 
                  ? `O post será gerado no formato ${aspectRatio === 'story' ? 'Story (9:16)' : 'Retrato (3:4)'}.`
                  : 'Nenhuma foto selecionada.'}
              </p> */}
            </div>"""

# Replace old preview area with new flexy one
# I need to match everything from {/* The Preview Area */} to </div>\n            {/* Mobile Action Group (hidden on desktop) */}
pattern_preview = re.compile(r'\{\/\* The Preview Area \*\/\}.*?<\/div>\s*\{\/\* Mobile Action Group \(hidden on desktop\) \*\/\}', re.DOTALL)
new_content = pattern_preview.sub(new_image_container + "\n            {/* Mobile Action Group (hidden on desktop) */}", new_content)

with open('src/App.tsx', 'w') as f:
    f.write(new_content)

