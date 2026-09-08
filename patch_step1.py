with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the existing header (containing the mobile tabs)
old_header = """            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
              
              {/* Segmented Control for Mobile */}
              <div className="flex lg:hidden bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl w-full">
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
            </header>"""

new_header = """            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
              
              {/* Segmented Control for Mobile - Sticky Wrapper */}
              <div className="sticky top-0 z-40 bg-gray-50 dark:bg-zinc-950 pb-4 pt-2 shadow-sm -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:bg-transparent lg:shadow-none lg:p-0 flex lg:hidden mt-2">
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

if old_header in content:
    content = content.replace(old_header, new_header)
    print("Header replaced successfully.")
else:
    print("Header not found.")

with open('src/App.tsx', 'w') as f:
    f.write(content)
