import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("value={targetAudience}", "value={targetAudience || ''}")
content = content.replace("value={generatedCaption}", "value={generatedCaption || ''}")

with open('src/App.tsx', 'w') as f:
    f.write(content)

