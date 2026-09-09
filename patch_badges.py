import os
import re

templates = [
    'src/templates/ModernTemplate.tsx',
    'src/templates/BoldTemplate.tsx',
    'src/templates/ElegantTemplate.tsx',
    'src/templates/LuxuryTemplate.tsx'
]

for template in templates:
    with open(template, 'r') as f:
        content = f.read()

    # We need to find the badge div and fix its classes and styles.
    # We will remove any bg-red-600, bg-orange-600, bg-black etc.
    # And make sure inline-block or inline-flex is there.

    # 1. ElegantTemplate
    if 'ElegantTemplate' in template:
        # It's an absolute div
        content = re.sub(r'className="absolute -top-\[18px\] left-\[32px\]\s+px-\[24px\]', r'className="absolute -top-[18px] left-[32px] inline-block px-[24px]', content)

    # 2. LuxuryTemplate
    if 'LuxuryTemplate' in template:
        content = content.replace('inline-block bg-orange-600', 'inline-block')

    # 3. ModernTemplate
    if 'ModernTemplate' in template:
        pass # already flex

    # 4. BoldTemplate
    if 'BoldTemplate' in template:
        pass # already flex

    with open(template, 'w') as f:
        f.write(content)

