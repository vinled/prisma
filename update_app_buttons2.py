import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_button_pattern = r'''<button[^>]*onClick=\{\(\) => \{\s*if \(window\.innerWidth < 768\) \{\s*handleShare\(\);\s*\} else \{\s*handleDownload\(\);\s*\}\s*\}\}[^>]*className="absolute bottom-4 right-4[^"]*"[^>]*>.*?<\/button>'''

new_buttons = """{/* Desktop Download Button (hidden on mobile) */}
                  <button
                    onClick={handleDownload}
                    disabled={isExporting || images.length === 0}
                    className="hidden md:flex items-center justify-center p-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>
                      {isExporting ? 'Gerando...' : (images.length > 1 ? `Baixar Zip (${images.length})` : 'Baixar imagem')}
                    </span>
                  </button>

                  {/* Mobile Action Group (hidden on desktop) */}
                  <div className="absolute bottom-4 right-4 z-10 flex items-center justify-center gap-3 md:hidden">
                    <button
                      onClick={handleDownload}
                      disabled={isExporting || images.length === 0}
                      className="w-12 h-12 rounded-full shadow-lg bg-white text-emerald-600 border border-slate-100 hover:bg-slate-50 flex items-center justify-center transition-all duration-300 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleShare}
                      disabled={isExporting || images.length === 0}
                      className="w-12 h-12 rounded-full shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all duration-300 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>"""

content = re.sub(old_button_pattern, new_buttons, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
