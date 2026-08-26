import re

with open('src/components/ImageUploader.tsx', 'r') as f:
    content = f.read()

content = content.replace('capture="environment" ', '')

with open('src/components/ImageUploader.tsx', 'w') as f:
    f.write(content)
