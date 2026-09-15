import re

# --- Template Selector ---
with open('src/components/TemplateSelector.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">',
    '<div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 pb-2 scrollbar-hide snap-x">'
)
content = content.replace(
    'className={`p-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center ${',
    'className={`min-w-[120px] md:min-w-0 snap-center p-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center ${'
)

with open('src/components/TemplateSelector.tsx', 'w') as f:
    f.write(content)

# --- Aspect Ratio Selector ---
with open('src/components/AspectRatioSelector.tsx', 'r') as f:
    content = f.read()

content = content.replace('py-3 px-4', 'py-2 px-4')
content = content.replace('w-5 h-5', 'w-4 h-4')

with open('src/components/AspectRatioSelector.tsx', 'w') as f:
    f.write(content)

