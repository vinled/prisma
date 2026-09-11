import re

with open('src/components/ImageUploader.tsx', 'r') as f:
    content = f.read()

old_btn = 'className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"'
new_btn = 'className="absolute -top-1 -right-1 p-3 md:top-1 md:right-1 md:p-1.5 bg-white/90 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"'

old_icon = '<X className="w-3 h-3" />'
new_icon = '<X className="w-4 h-4 md:w-3 md:h-3" />'

content = content.replace(old_btn, new_btn)
content = content.replace(old_icon, new_icon)

with open('src/components/ImageUploader.tsx', 'w') as f:
    f.write(content)

