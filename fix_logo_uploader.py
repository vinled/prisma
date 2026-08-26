import re

with open('src/components/LogoUploader.tsx', 'r') as f:
    content = f.read()

content = content.replace("'imoveis'", "'fotos_imoveis'")

with open('src/components/LogoUploader.tsx', 'w') as f:
    f.write(content)
