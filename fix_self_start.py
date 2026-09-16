import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_preview = "lg:h-[calc(100vh-3rem)] self-start lg:w-full max-w-none lg:max-w-full min-w-0"
new_preview = "lg:h-[calc(100vh-3rem)] lg:self-start w-auto lg:w-full min-w-0"

content = content.replace(old_preview, new_preview)

with open('src/App.tsx', 'w') as f:
    f.write(content)

