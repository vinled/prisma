import re

with open('src/components/MyProperties.tsx', 'r') as f:
    content = f.read()

content = content.replace("value={termoBusca}", "value={termoBusca || ''}")

with open('src/components/MyProperties.tsx', 'w') as f:
    f.write(content)

