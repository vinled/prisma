import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const mockImageUrl = "[^"]+";', 'const mockImageUrl = "/20260720_112323.jpg";', content)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
