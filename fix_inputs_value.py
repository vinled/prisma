import re

with open('src/components/PropertyForm.tsx', 'r') as f:
    content = f.read()

# I will replace all instances of value={details.field} with value={details.field || ''}

replacements = [
    (r'value={details.propertyType}', r"value={details.propertyType || ''}"),
    (r'value={details.propertySubtype}', r"value={details.propertySubtype || ''}"),
    (r'value={details.title}', r"value={details.title || ''}"),
    (r'value={details.neighborhood}', r"value={details.neighborhood || ''}"),
    (r'value={details.city}', r"value={details.city || ''}"),
    (r'value={details.state}', r"value={details.state || ''}"),
    (r'value={details.price}', r"value={details.price || ''}"),
    (r'value={details.propertyCode}', r"value={details.propertyCode || ''}"),
    (r'value={details.whatsapp}', r"value={details.whatsapp || ''}")
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open('src/components/PropertyForm.tsx', 'w') as f:
    f.write(content)

