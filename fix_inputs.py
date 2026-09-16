import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# I will replace all inputs inside the Mobile Editor that have type="range"
# Since they are inside `{activeMobileTool === 'adjust' && (`, I can just target that block

old_adjust_block = content.split("{activeMobileTool === 'adjust' && (")[1].split(")}")[0]

new_adjust_block = old_adjust_block.replace(
    'className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"',
    'className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600" onTouchStart={() => setIsDraggingSlider(true)} onTouchEnd={() => setIsDraggingSlider(false)} onMouseDown={() => setIsDraggingSlider(true)} onMouseUp={() => setIsDraggingSlider(false)}'
)

content = content.replace(old_adjust_block, new_adjust_block)

with open('src/App.tsx', 'w') as f:
    f.write(content)

