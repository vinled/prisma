with open('src/App.tsx', 'r') as f:
    content = f.read()

mobile_action_group = """                  {/* Mobile Action Group (hidden on desktop) */}
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

# Remove from original location
content = content.replace(mobile_action_group, "")

# We will change it to normal flow buttons and put them just before Estilo
mobile_action_group_new = """            {/* Mobile Action Group (hidden on desktop) */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-6">
              <button
                onClick={handleDownload}
                disabled={isExporting || images.length === 0}
                className="flex-1 py-3 rounded-xl shadow-sm bg-white dark:bg-zinc-800 text-emerald-600 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 flex items-center justify-center transition-all duration-300 font-semibold active:scale-95 disabled:opacity-50"
              >
                <Download className="w-5 h-5 mr-2" /> Baixar Imagem
              </button>
              <button
                onClick={handleShare}
                disabled={isExporting || images.length === 0}
                className="flex-1 py-3 rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all duration-300 font-semibold active:scale-95 disabled:opacity-50"
              >
                <Share2 className="w-5 h-5 mr-2" /> Compartilhar
              </button>
            </div>"""

estilo_start = '<section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\n              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>'

content = content.replace(estilo_start, mobile_action_group_new + "\n            " + estilo_start)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Patch mobile actions applied.")
