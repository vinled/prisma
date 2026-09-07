import re

with open('src/templates/ElegantTemplate.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'\{details\.price\?\.trim\(\) && \(\s*<div className="([^"]+)">\s*<span className=\{`([^`]+)`\}>\s*\{details\.price\}\s*</span>\s*</div>\s*\)\}', re.MULTILINE)
match = pattern.search(content)

if match:
    div_class = match.group(1)
    span_class = match.group(2)
    # The new component only accepts a single `baseSizeClassName`, which replaces the outer div in PriceDisplay, but we can combine them.
    class_name = f"{div_class} {span_class}"
    new_component = f'<PriceDisplay details={{details}} aspectRatio={{aspectRatio}} baseSizeClassName="{class_name}" />'
    content = content[:match.start()] + new_component + content[match.end():]
    
    if 'PriceDisplay' not in content:
        import_statement = "import { PriceDisplay } from './PriceDisplay';\n"
        content = content.replace("import React", import_statement + "import React")
    
    with open('src/templates/ElegantTemplate.tsx', 'w') as f:
        f.write(content)
    print("Patched ElegantTemplate")
