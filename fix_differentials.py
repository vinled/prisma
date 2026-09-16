import re

with open('src/components/PropertyForm.tsx', 'r') as f:
    content = f.read()

content = content.replace("selected={details.differentials}", "selected={details.differentials || []}")

with open('src/components/PropertyForm.tsx', 'w') as f:
    f.write(content)

