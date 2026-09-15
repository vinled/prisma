import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update lucide imports
content = re.sub(
    r"import { (.*?) } from 'lucide-react';",
    r"import { \1, LayoutTemplate, Crop, Tag, SlidersHorizontal } from 'lucide-react';",
    content
)

# 2. Add state for activeMobileTool
state_insert = """  const [activeTab, setActiveTab] = useState<'gerador' | 'meus_imoveis'>('gerador');
  const [mobileViewTab, setMobileViewTab] = useState<'form' | 'preview'>('form');"""

new_state = """  const [activeTab, setActiveTab] = useState<'gerador' | 'meus_imoveis'>('gerador');
  const [mobileViewTab, setMobileViewTab] = useState<'form' | 'preview'>('form');
  const [activeMobileTool, setActiveMobileTool] = useState<'template' | 'format' | 'badge' | 'adjust' | 'export' | null>('template');"""

content = content.replace(state_insert, new_state)

# 3. Create the renderMobileEditor function
# We will inject this right before renderStyleControls
render_mobile_editor = """  const renderMobileEditor = () => {
    return (
      <div className="flex flex-col w-full bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 block lg:hidden shrink-0 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.05)] relative z-20">
        
        {/* Active Panel */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden bg-gray-50 dark:bg-zinc-950 ${activeMobileTool ? 'border-b border-gray-200 dark:border-zinc-800 max-h-[55vh]' : 'max-h-0'}`}>
          <div className="p-5 overflow-y-auto max-h-[55vh]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {activeMobileTool === 'template' && 'Selecionar Estilo'}
                {activeMobileTool === 'format' && 'Formato da Arte'}
                {activeMobileTool === 'badge' && 'Selo Destaque'}
                {activeMobileTool === 'adjust' && 'Ajustes Finos'}
                {activeMobileTool === 'export' && 'Exportar Arte'}
              </h3>
              <button onClick={() => setActiveMobileTool(null)} className="p-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-300">
                <X size={16} />
              </button>
            </div>

            {activeMobileTool === 'template' && (
              <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
            )}
            {activeMobileTool === 'format' && (
              <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
            )}
            {activeMobileTool === 'badge' && (
              <div className="flex flex-wrap gap-2">
                {['Nenhum', 'VENDIDO', 'EXCLUSIVIDADE', 'BAIXOU O VALOR', 'OPORTUNIDADE'].map(selo => {
                  const isNenhum = selo === 'Nenhum';
                  const isActive = isNenhum ? seloAtivo === '' : seloAtivo === selo;
                  return (
                    <button
                      key={selo}
                      onClick={() => setSeloAtivo(isNenhum ? '' : selo)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        isActive 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                          : 'bg-white text-gray-700 border-gray-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600'
                      }`}
                    >
                      {selo}
                    </button>
                  );
                })}
              </div>
            )}
            {activeMobileTool === 'adjust' && (
              <div className="space-y-6">
                {['modern', 'elegant', 'luxury', 'bold', 'minimalist', 'myway'].includes(selectedTemplate) ? (
                  <>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-2 font-medium">
                        <label>Posição da Foto (Horizontal)</label>
                        <span>{templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50} 
                        onChange={(e) => setTemplateOptions({...templateOptions, imagePositions: {...templateOptions.imagePositions, [previewIndex]: Number(e.target.value)}})}
                        className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-2 font-medium">
                        <label>Escurecimento (Degradê)</label>
                        <span>{templateOptions.gradientOpacity ?? 45}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={templateOptions.gradientOpacity ?? 45} 
                        onChange={(e) => setTemplateOptions({...templateOptions, gradientOpacity: Number(e.target.value)})}
                        className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-2 font-medium">
                        <label>Tamanho do Logo</label>
                        <span>{templateOptions.logoSize ?? 100}%</span>
                      </div>
                      <input 
                        type="range" min="50" max="150" 
                        value={templateOptions.logoSize ?? 100} 
                        onChange={(e) => setTemplateOptions({...templateOptions, logoSize: Number(e.target.value)})}
                        className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">Este template não possui ajustes avançados.</p>
                )}
              </div>
            )}
            {activeMobileTool === 'export' && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isExporting || images.length === 0}
                  className="w-full py-3.5 rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all duration-300 font-semibold active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-5 h-5 mr-2" /> {isExporting ? (exportProgressText || "Gerando...") : (images.length > 1 ? `Baixar Todas (${images.length})` : "Baixar Imagem")}
                </button>
                <button
                  onClick={handleShare}
                  disabled={isExporting || images.length === 0}
                  className="w-full py-3.5 rounded-xl shadow-sm bg-white dark:bg-zinc-800 text-emerald-600 border border-emerald-200 dark:border-zinc-700 hover:bg-slate-50 flex items-center justify-center transition-all duration-300 font-semibold active:scale-95 disabled:opacity-50"
                >
                  <Share2 className="w-5 h-5 mr-2" /> Compartilhar Arte
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar Nav */}
        <div className="flex items-center justify-between px-2 pt-2 pb-safe bg-white dark:bg-zinc-900">
          {[
            { id: 'template', icon: LayoutTemplate, label: 'Modelo' },
            { id: 'format', icon: Crop, label: 'Formato' },
            { id: 'badge', icon: Tag, label: 'Selo' },
            { id: 'adjust', icon: SlidersHorizontal, label: 'Ajustes' },
            { id: 'export', icon: Download, label: 'Exportar' }
          ].map(tool => {
            const Icon = tool.icon;
            const isActive = activeMobileTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveMobileTool(isActive ? null : tool.id as any)}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-200 ${isActive ? 'text-emerald-600' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'}`}
              >
                <div className={`p-1.5 rounded-full mb-1 transition-colors ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{tool.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    );
  };

  const renderStyleControls = () => ("""

content = content.replace("  const renderStyleControls = () => (", render_mobile_editor)


with open('src/App.tsx', 'w') as f:
    f.write(content)

