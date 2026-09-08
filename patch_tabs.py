import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add state
state_code = "  const [activeTab, setActiveTab] = useState<'criacao' | 'meus_imoveis' | 'minha_marca' | 'minha_conta'>('criacao');\n  const [mobileViewTab, setMobileViewTab] = useState<'form' | 'preview'>('form');"
content = re.sub(r"const \[activeTab, setActiveTab\] = useState.*?\('criacao'\);", state_code, content, count=1)

# 2. Modify Header
old_header = """            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
            </header>"""

new_header = """            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
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
content = content.replace(old_header, new_header)

# 3. Modify Controls side
old_controls = '          <div className="space-y-8 order-2 lg:order-1 min-w-0 w-full max-w-full">'
new_controls = '          <div className={`space-y-8 order-2 lg:order-1 min-w-0 w-full max-w-full ${mobileViewTab === \'form\' ? \'block\' : \'hidden lg:block\'}`}>'
content = content.replace(old_controls, new_controls)

# 4. Modify Preview side
old_preview = '          <div className="contents lg:block lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full lg:space-y-6 min-w-0">'
new_preview = '          <div className={`${mobileViewTab === \'preview\' ? \'block\' : \'hidden\'} lg:block lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full lg:space-y-6 min-w-0`}>'
content = content.replace(old_preview, new_preview)

# 5. Remove 'order-1 lg:order-none' and 'sticky top-0 z-40' from the preview child wrapper, as they are no longer needed on mobile
# Old string has a lot of classes, let's target the exact one
old_preview_child = '            <div className="order-1 lg:order-none sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative">'
new_preview_child = '            <div className="bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative">'
content = content.replace(old_preview_child, new_preview_child)

with open('src/App.tsx', 'w') as f:
    f.write(content)
