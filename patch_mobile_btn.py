import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<Download className="w-5 h-5 mr-2" /> Baixar Imagem',
    '<Download className="w-5 h-5 mr-2" /> {isExporting ? (exportProgressText || "Gerando...") : (images.length > 1 ? `Baixar Todas (${images.length})` : "Baixar Imagem")}'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
