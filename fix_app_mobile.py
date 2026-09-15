import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Selo panel: make it horizontally scrollable
old_selo = """            {activeMobileTool === 'badge' && (
              <div className="flex flex-wrap gap-2">"""
new_selo = """            {activeMobileTool === 'badge' && (
              <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x">"""
content = content.replace(old_selo, new_selo)

old_selo_btn = """                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${"""
new_selo_btn = """                      className={`shrink-0 snap-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${"""
content = content.replace(old_selo_btn, new_selo_btn)


# 2. Adjust panel: compact sliders
old_adjust = """            {activeMobileTool === 'adjust' && (
              <div className="space-y-6">"""
new_adjust = """            {activeMobileTool === 'adjust' && (
              <div className="space-y-3">"""
content = content.replace(old_adjust, new_adjust)

# compact the inputs
content = content.replace('className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-2 font-medium"', 'className="flex justify-between text-[11px] text-gray-500 dark:text-zinc-400 mb-1 font-medium"')
content = content.replace('w-full h-2 bg-gray-200', 'w-full h-1.5 bg-gray-200')


# 3. Export panel: make buttons row
old_export = """            {activeMobileTool === 'export' && (
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
            )}"""

new_export = """            {activeMobileTool === 'export' && (
              <div className="flex flex-row gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isExporting || images.length === 0}
                  className="flex-1 py-2.5 rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all duration-300 font-semibold active:scale-95 disabled:opacity-50 text-sm"
                >
                  <Download className="w-4 h-4 mr-2" /> {isExporting ? (exportProgressText || "Gerando...") : (images.length > 1 ? `Baixar Todas` : "Baixar")}
                </button>
                <button
                  onClick={handleShare}
                  disabled={isExporting || images.length === 0}
                  className="flex-1 py-2.5 rounded-xl shadow-sm bg-white dark:bg-zinc-800 text-emerald-600 border border-emerald-200 dark:border-zinc-700 hover:bg-slate-50 flex items-center justify-center transition-all duration-300 font-semibold active:scale-95 disabled:opacity-50 text-sm"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                </button>
              </div>
            )}"""
content = content.replace(old_export, new_export)

# 4. Make the max height of the bottom sheet smaller so it doesn't take too much vertical space.
# Current is max-h-[55vh]. Let's change it to something like max-h-[40vh] or just rely on content height (which is smaller now)
# The transition wrapper: 
content = content.replace(
    'max-h-[55vh]',
    'max-h-[40vh]'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

