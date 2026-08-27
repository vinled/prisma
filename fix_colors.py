import re

with open('src/types.ts', 'r') as f:
    content = f.read()
content = re.sub(r"\s*primaryColor:\s*string;", "", content)
content = re.sub(r"\s*secondaryColor:\s*string;", "", content)
with open('src/types.ts', 'w') as f:
    f.write(content)

with open('src/components/BrandKitForm.tsx', 'r') as f:
    content = f.read()

# Remove primaryColor and secondaryColor from default state
content = re.sub(r"\s*primaryColor:\s*'[^']+',", "", content)
content = re.sub(r"\s*secondaryColor:\s*'[^']+',", "", content)

# Remove color picker inputs
color_pickers_regex = r"\{\/\* Cores \*\/\}.*?\<\/div\>\n\s*\<\/div\>\n\s*\<\/div\>"
content = re.sub(color_pickers_regex, "", content, flags=re.DOTALL)

with open('src/components/BrandKitForm.tsx', 'w') as f:
    f.write(content)

with open('src/templates/ModernTemplate.tsx', 'r') as f:
    content = f.read()
content = content.replace("const primaryColor = brandKit?.primaryColor || '#2563eb';", "const primaryColor = '#2563eb';")
with open('src/templates/ModernTemplate.tsx', 'w') as f:
    f.write(content)
    
with open('src/templates/MinimalistTemplate.tsx', 'r') as f:
    content = f.read()
content = content.replace("const primaryColor = brandKit?.primaryColor || '#2563eb';", "const primaryColor = '#2563eb';")
with open('src/templates/MinimalistTemplate.tsx', 'w') as f:
    f.write(content)
    
with open('src/templates/BoldTemplate.tsx', 'r') as f:
    content = f.read()
content = content.replace("const primaryColor = brandKit?.primaryColor || '#ef4444';", "const primaryColor = '#ef4444';")
with open('src/templates/BoldTemplate.tsx', 'w') as f:
    f.write(content)

print("Removed brand colors successfully.")
