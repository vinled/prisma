import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Change height: aspectRatio === 'story' ? 1920 : 1080 to 1440
content = content.replace("aspectRatio === 'story' ? 1920 : 1080", "aspectRatio === 'story' ? 1920 : 1440")
content = content.replace("aspectRatio === 'story' ? '1920px' : '1080px'", "aspectRatio === 'story' ? '1920px' : '1440px'")

# Change aspect-square to aspect-[3/4]
content = content.replace("aspectRatio === 'feed' ? 'aspect-square' : 'aspect-[9/16]'", "aspectRatio === 'feed' ? 'aspect-[3/4]' : 'aspect-[9/16]'")

# Change Quadrado (1:1) to Retrato (3:4)
content = content.replace("'Quadrado (1:1)'", "'Retrato (3:4)'")

with open('src/App.tsx', 'w') as f:
    f.write(content)
