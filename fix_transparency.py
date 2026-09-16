import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_classes = "isDraggingSlider ? 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl' : 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800'"
new_classes = "isDraggingSlider ? 'bg-white/20 dark:bg-zinc-950/20' : 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800'"

content = content.replace(old_classes, new_classes)

with open('src/App.tsx', 'w') as f:
    f.write(content)

