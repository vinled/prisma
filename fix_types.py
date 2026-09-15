import re

with open('src/types.ts', 'r') as f:
    content = f.read()

old = '  price: string;'
new = '  price: string;\n  previousPrice?: string;\n  porteiraFechada?: boolean;'

content = content.replace(old, new)
old_tid = "export type TemplateId = 'modern' | 'luxury' | 'bold' | 'elegant' | 'minimalist';"
new_tid = "export type TemplateId = 'modern' | 'luxury' | 'bold' | 'elegant' | 'minimalist' | 'myway';"
content = content.replace(old_tid, new_tid)

with open('src/types.ts', 'w') as f:
    f.write(content)

