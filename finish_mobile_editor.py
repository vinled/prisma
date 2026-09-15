import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update Preview Side container
old_preview_side = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-auto min-h-[calc(100dvh-12rem)]' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>
            <div className="block lg:hidden shrink-0 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
              {renderStyleControls()}
            </div>
            <div className="shrink-0 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-t-2xl lg:shadow-sm lg:border lg:border-b-0 border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative z-20">"""

new_preview_side = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-[calc(100dvh-120px)] sm:h-[calc(100dvh-140px)] -mx-4 sm:-mx-6' : 'hidden'} lg:mx-0 lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>
            <div className="shrink-0 bg-white dark:bg-[#0f111a] px-4 sm:px-6 pb-2 pt-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-t-2xl lg:shadow-sm lg:border lg:border-b-0 border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative z-20">"""

content = content.replace(old_preview_side, new_preview_side)


# 2. Update The Preview Area (min-h-[500px] -> min-h-0)
old_preview_area = """            {/* The Preview Area */}
            <div className="flex flex-1 min-h-[500px] overflow-hidden z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center relative">
                <div ref={previewContainerRef} className="flex flex-1 h-full min-h-[500px] items-center justify-center w-full max-w-full lg:max-w-md mx-auto bg-gray-100 dark:bg-zinc-950 lg:rounded-xl relative p-0 lg:p-4 transition-colors duration-200 overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-auto min-h-[500px]">"""

new_preview_area = """            {/* The Preview Area */}
            <div className="flex flex-1 min-h-0 overflow-hidden z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center relative">
                <div ref={previewContainerRef} className="flex flex-1 h-full min-h-0 items-center justify-center w-full max-w-full lg:max-w-md mx-auto bg-gray-100 dark:bg-zinc-950 lg:rounded-xl relative p-0 lg:p-4 transition-colors duration-200 overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-full min-h-0">"""

content = content.replace(old_preview_area, new_preview_area)


# 3. Replace Mobile Action Group with Mobile Editor
old_action_group_pattern = re.compile(r'\{\/\* Mobile Action Group \(hidden on desktop\) \*\/\}.*?<\/div>', re.DOTALL)

# Let's just use string replacement manually to be safe.
# Actually, the file has exactly:
old_action_group = """            {/* Mobile Action Group (hidden on desktop) */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-6">
              <button
                onClick={handleDownload}
                disabled={isExporting || images.length === 0}
                className="flex-1 py-3 rounded-xl shadow-sm bg-white dark:bg-zinc-800 text-emerald-600 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 flex items-center justify-center transition-all duration-300 font-semibold active:scale-95 disabled:opacity-50"
              >
                <Download className="w-5 h-5 mr-2" /> {isExporting ? (exportProgressText || "Gerando...") : (images.length > 1 ? `Baixar Todas (${images.length})` : "Baixar Imagem")}
              </button>
              <button
                onClick={handleShare}
                disabled={isExporting || images.length === 0}
                className="flex-1 py-3 rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all duration-300 font-semibold active:scale-95 disabled:opacity-50"
              >
                <Share2 className="w-5 h-5 mr-2" /> Compartilhar
              </button>
            </div>"""

new_action_group = """            {renderMobileEditor()}"""

content = content.replace(old_action_group, new_action_group)


with open('src/App.tsx', 'w') as f:
    f.write(content)

