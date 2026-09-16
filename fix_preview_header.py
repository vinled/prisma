import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_header = """              <div className="flex flex-wrap w-full gap-2 items-start md:items-center justify-between mb-6">
                <h2 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full">Pré-visualização do Post</h2>
                <div className="flex flex-wrap items-center gap-2 space-x-0">
                  <button
                    onClick={() => {
                      setActiveTab('meus_imoveis');
                      setIdEmEdicao(null);
                    }}
                    className="hidden lg:block px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  {idEmEdicao && (
                    <button
                      onClick={handleSaveOnly}
                      disabled={isExporting}
                      className="px-4 py-2 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Salvar
                    </button>
                  )}
                  {/* Desktop Download Button (hidden on mobile) */}
                  <button
                    onClick={handleDownload}
                    disabled={isExporting || images.length === 0}
                    className="hidden md:flex items-center justify-center p-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>
                      {isExporting ? (exportProgressText || 'Gerando...') : (images.length > 1 ? `Baixar Todas (${images.length})` : 'Baixar Imagem')}
                    </span>
                  </button>


                </div>
              </div>

              {images.length > 1 && (
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewIndex(idx)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${previewIndex === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-700'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}"""


new_header = """              <div className="flex w-full items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full pr-4 border-r border-gray-200 dark:border-zinc-800">Pré-visualização do Post</h2>
                  
                  {idEmEdicao && (
                    <button
                      onClick={handleSaveOnly}
                      disabled={isExporting}
                      className="px-4 py-1.5 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Salvar
                    </button>
                  )}

                  {images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPreviewIndex(idx)}
                          className={`px-3 py-1.5 shrink-0 rounded-full text-sm font-medium transition-colors ${previewIndex === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-700'}`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('meus_imoveis');
                      setIdEmEdicao(null);
                    }}
                    className="hidden lg:block px-4 py-1.5 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  {/* Desktop Download Button (hidden on mobile) */}
                  <button
                    onClick={handleDownload}
                    disabled={isExporting || images.length === 0}
                    className="hidden md:flex items-center justify-center py-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>
                      {isExporting ? (exportProgressText || 'Gerando...') : (images.length > 1 ? `Baixar Todas (${images.length})` : 'Baixar Imagem')}
                    </span>
                  </button>
                </div>
              </div>"""

content = content.replace(old_header, new_header)

with open('src/App.tsx', 'w') as f:
    f.write(content)

