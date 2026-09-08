with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make the preview area sticky.
# The area starts around:
# {/* The Preview Area */}
# <div ref={previewContainerRef} className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200 max-h-[50vh] md:max-h-none overflow-hidden">

# We need to wrap it and the pagination, or just the preview box, in a sticky container.
# The user said: Envolva a área de pré-visualização da arte (a imagem 3:4 gerada) em um container próprio com sticky top-[60px] z-[50] bg-slate-900 pb-4

# We'll replace:
old_preview_area = """              {/* The Preview Area */}
              <div ref={previewContainerRef} className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200 max-h-[50vh] md:max-h-none overflow-hidden">"""

new_preview_area = """              {/* The Preview Area */}
              <div className="sticky top-[60px] z-[50] bg-white dark:bg-[#0f111a] lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-0 lg:mx-0">
                <div ref={previewContainerRef} className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200 max-h-[50vh] md:max-h-none overflow-hidden">"""

content = content.replace(old_preview_area, new_preview_area)

# Now we need to close the new sticky wrapper.
# The preview area ends with:
old_preview_end = """                )}
              </div>
              <p className="text-center text-sm text-gray-400 mt-4">"""

new_preview_end = """                )}
              </div>
              <p className="text-center text-sm text-gray-400 mt-4">
                {images.length > 0 
                  ? `O post será gerado no formato ${aspectRatio === 'story' ? 'Story (9:16)' : 'Retrato (3:4)'.}`
                  : 'Nenhuma foto selecionada.'}
              </p>
              </div> {/* End Sticky Wrapper */}
              
              {/* Spacer so things don't jump immediately under the sticky element if we don't want them to, though they will scroll under it naturally */}
              <div className="pt-2"></div>
              """
# We must be careful because the previous paragraph is already there. Let's just do a clean replacement.

import re
content = re.sub(r'              </p>\n            </div>\n            {/\* Smart Caption Module \*/}', r'              </p>\n              </div> {/* End Sticky Wrapper */}\n            </div>\n            {/* Smart Caption Module */}', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Patch 2 applied.")

