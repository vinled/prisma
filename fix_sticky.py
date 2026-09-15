import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# We want to extract the sticky wrapper from inside the header and put it right after </header>
old_header = """            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
              
              {/* Segmented Control for Mobile - Sticky Wrapper */}
              <div className="sticky top-0 z-[60] w-full bg-gray-50 dark:bg-zinc-950 py-3 border-b border-gray-200 dark:border-white/10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:bg-transparent lg:shadow-none lg:p-0 lg:border-none flex lg:hidden mt-0">
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl w-full">
                  <button
                    onClick={() => setMobileViewTab('form')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mobileViewTab === 'form' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    📝 Editar Dados
                  </button>
                  <button
                    onClick={() => setMobileViewTab('preview')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mobileViewTab === 'preview' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    📱 Ver Arte
                  </button>
                </div>
              </div>
            </header>"""

new_header = """            <header className="hidden md:flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
            </header>

            {/* Segmented Control for Mobile - Sticky Wrapper */}
            <div className="sticky top-0 z-[60] w-full bg-gray-50 dark:bg-zinc-950 py-3 mb-6 border-b border-gray-200 dark:border-white/10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:hidden">
              <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl w-full shadow-sm">
                <button
                  onClick={() => setMobileViewTab('form')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mobileViewTab === 'form' ? 'bg-orange-500 text-white shadow-md scale-[1.02]' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
                >
                  📝 Editar Dados
                </button>
                <button
                  onClick={() => setMobileViewTab('preview')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mobileViewTab === 'preview' ? 'bg-emerald-600 text-white shadow-md scale-[1.02]' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
                >
                  📱 Ver Arte
                </button>
              </div>
            </div>"""

content = content.replace(old_header, new_header)

with open('src/App.tsx', 'w') as f:
    f.write(content)

