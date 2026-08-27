import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'Instagram em 3 Segundos.</span>',
    'Instagram em segundos</span>'
)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)

print("Text updated")
