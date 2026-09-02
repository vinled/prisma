import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("Feed (1:1)", "Feed (3:4)")

# For the "Antes e Depois" section, we might need to adjust the width/height to 1080x1440
# Look for height: '1080px' near the TemplateRenderer inside LandingPage
content = content.replace("width: '1080px', height: '1080px'", "width: '1080px', height: '1440px'")

# Check if there is aspect-square for the Antes and Depois cards
content = content.replace("aspect-square border", "aspect-[3/4] border")

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
