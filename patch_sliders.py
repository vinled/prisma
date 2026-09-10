import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the preview options
old_preview = "options={{...templateOptions, badge: seloAtivo}}"
new_preview = "options={{...templateOptions, badge: seloAtivo, imagePositionX: templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50}}"

content = content.replace(old_preview, new_preview, 1)

# Replace the export options
old_export = "options={{...templateOptions, badge: seloAtivo}}"
new_export = "options={{...templateOptions, badge: seloAtivo, imagePositionX: templateOptions.imagePositions?.[idx] ?? templateOptions.imagePositionX ?? 50}}"

content = content.replace(old_export, new_export, 1)

# Now, we need to replace the specific slider for imagePositionX
slider_old = """                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Posição da Foto (Esquerda - Direita)</label>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">
                      <span>{templateOptions.imagePositionX ?? 50}%</span>
                      </span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                      value={templateOptions.imagePositionX ?? 50} 
                      onChange={(e) => setTemplateOptions({...templateOptions, imagePositionX: Number(e.target.value)})}
                    />"""

# wait, I need to check exactly what the slider code looks like.
