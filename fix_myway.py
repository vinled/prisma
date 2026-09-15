import re

with open('src/templates/MyWayTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace("p-[${pSize}px]", "${isStory ? 'p-[86px]' : 'p-[64px]'}")

with open('src/templates/MyWayTemplate.tsx', 'w') as f:
    f.write(content)

