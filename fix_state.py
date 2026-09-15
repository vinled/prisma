import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = "const [mobileViewTab, setMobileViewTab] = useState<'form' | 'preview'>('form');"
replacement = "const [mobileViewTab, setMobileViewTab] = useState<'form' | 'preview'>('form');\n  const [activeMobileTool, setActiveMobileTool] = useState<'template' | 'format' | 'badge' | 'adjust' | 'export' | null>('template');"

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)

