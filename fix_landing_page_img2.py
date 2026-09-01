import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const mockImageUrl = "[^"]+";', 'const mockImageUrl = "/image.png";', content)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
