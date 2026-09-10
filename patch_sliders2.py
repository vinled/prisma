import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the specific slider for imagePositionX
slider_old = """                  <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Ajustes da Imagem</h3>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1">
                      <label>Posição da Foto (Esquerda - Direita)</label>
                      <span>{templateOptions.imagePositionX}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={templateOptions.imagePositionX} 
                      onChange={(e) => setTemplateOptions({...templateOptions, imagePositionX: Number(e.target.value)})}
                      className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>"""

slider_new = """                  <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Ajustes da Imagem</h3>
                  
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
                  </div>"""

if slider_old in content:
    content = content.replace(slider_old, slider_new)
else:
    print("Old slider not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
