import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace both occurrences of setImages([]); inside "Criação Rápida" clicks
old_reset = "setImages([]);"
new_reset = "setImages([]);\n              setGeneratedCaption('');"

content = content.replace(old_reset, new_reset)

with open('src/App.tsx', 'w') as f:
    f.write(content)
