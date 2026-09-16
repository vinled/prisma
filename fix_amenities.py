import re

with open('src/components/PropertyForm.tsx', 'r') as f:
    content = f.read()

# Replace details.amenities with (details.amenities || [])
content = content.replace("details.amenities.filter", "(details.amenities || []).filter")

# Replace details.differentials with (details.differentials || [])
content = content.replace("details.differentials.filter", "(details.differentials || []).filter")
content = content.replace("details.differentials.includes", "(details.differentials || []).includes")

with open('src/components/PropertyForm.tsx', 'w') as f:
    f.write(content)

