import re

with open('src/components/BrandKitForm.tsx', 'r') as f:
    content = f.read()

# Remove the colors section
colors_regex = r"<div className=\"grid grid-cols-1 md:grid-cols-4 gap-4 pt-2\">.*?</div>\s*</div>"
content = re.sub(colors_regex, "", content, flags=re.DOTALL)

with open('src/components/BrandKitForm.tsx', 'w') as f:
    f.write(content)
