import re

with open('src/templates/LuxuryTemplate.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'\{details\.price\?\.trim\(\) && \(\s*<h3 className=\{`([^`]+)`\}>\s*\{details\.price\}\s*</h3>\s*\)\}', re.MULTILINE)
match = pattern.search(content)

if match:
    class_name = match.group(1)
    new_component = f'<PriceDisplay details={{details}} aspectRatio={{aspectRatio}} baseSizeClassName="{class_name}" />'
    content = content[:match.start()] + new_component + content[match.end():]
    
    if 'PriceDisplay' not in content:
        import_statement = "import { PriceDisplay } from './PriceDisplay';\n"
        content = content.replace("import React", import_statement + "import React")
    
    with open('src/templates/LuxuryTemplate.tsx', 'w') as f:
        f.write(content)
    print("Patched LuxuryTemplate")
