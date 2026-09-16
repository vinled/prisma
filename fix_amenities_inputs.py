import re

with open('src/components/AmenitiesSelector.tsx', 'r') as f:
    content = f.read()

content = content.replace("value={searchTerm}", "value={searchTerm || ''}")

with open('src/components/AmenitiesSelector.tsx', 'w') as f:
    f.write(content)

