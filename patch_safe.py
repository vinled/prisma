import re

with open('src/App_reverted.tsx', 'r') as f:
    content = f.read()

# 1. Define renderStyleControls right before the final `return (` of the `App` component
# Let's find the main return by matching `  return (\n    <>\n      <div className={`min-h-screen`
main_return = "  return (\n    <>\n      <div className={`min-h-screen"

render_fn = """  const renderStyleControls = () => (
    <>
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200 mt-6 lg:mt-0">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Selo (Opcional)</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Nenhum', 'VENDIDO', 'EXCLUSIVIDADE', 'BAIXOU O VALOR', 'OPORTUNIDADE'].map(selo => {
            const isNenhum = selo === 'Nenhum';
            const isActive = isNenhum ? seloAtivo === '' : seloAtivo === selo;
            return (
              <button
                key={selo}
                onClick={() => setSeloAtivo(isNenhum ? '' : selo)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  isActive 
                    ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-700 shadow-md' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700'
                }`}
              >
                {selo}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>
        <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Formato</h3>
          <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
        </div>
        
        {['modern', 'elegant', 'luxury', 'bold', 'minimalist', 'myway'].includes(selectedTemplate) && (
          <div className="mt-6 space-y-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Ajustes da Imagem</h3>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1">
                <label>Posição da Foto (Esquerda - Direita)</label>
                <span>{templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50} 
                onChange={(e) => setTemplateOptions({...templateOptions, imagePositions: {...templateOptions.imagePositions, [previewIndex]: Number(e.target.value)}})}
                className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1">
                <label>Escurecimento (Degradê)</label>
                <span>{templateOptions.gradientOpacity ?? 45}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={templateOptions.gradientOpacity ?? 45} 
                onChange={(e) => setTemplateOptions({...templateOptions, gradientOpacity: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1">
                <label>Tamanho do Logo</label>
                <span>{templateOptions.logoSize ?? 100}%</span>
              </div>
              <input 
                type="range" 
                min="50" max="150" 
                value={templateOptions.logoSize ?? 100} 
                onChange={(e) => setTemplateOptions({...templateOptions, logoSize: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );

  return (
    <>
      <div className={`min-h-screen"""

content = content.replace(main_return, render_fn)

# 2. Extract and remove the original sections in the Form Side.
original_regex = re.compile(
    r'<section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200 mt-6">\s*<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Selo \(Opcional\).*?</section>\s*<section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\s*<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">2\. Informações</h2>\s*<PropertyForm details=\{details\} brandKit=\{applyBrandKit \? brandKit : null\} onChange=\{setDetails\} />\s*</section>\s*<section className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\s*<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>.*?</section>',
    re.DOTALL
)

replaced_sections = """<div className="hidden lg:block">
              {renderStyleControls()}
            </div>

            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200 mt-6 lg:mt-0">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">2. Informações</h2>
              <PropertyForm details={details} brandKit={applyBrandKit ? brandKit : null} onChange={setDetails} />
            </section>"""

content, count = original_regex.subn(replaced_sections, content)
print(f"Replaced sections count: {count}")

# 3. Add renderStyleControls to the Preview Side
preview_side_anchor = """          {/* Art/Preview Side */}
          <div className={`order-1 lg:order-2 lg:sticky lg:top-8 self-start min-w-0 w-full max-w-full ${mobileViewTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className="flex flex-col gap-6">"""

preview_side_replaced = """          {/* Art/Preview Side */}
          <div className={`order-1 lg:order-2 lg:sticky lg:top-8 self-start min-w-0 w-full max-w-full ${mobileViewTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className="flex flex-col gap-6">
              
              <div className="block lg:hidden">
                {renderStyleControls()}
              </div>"""

content = content.replace(preview_side_anchor, preview_side_replaced)

with open('src/App_safe.tsx', 'w') as f:
    f.write(content)

