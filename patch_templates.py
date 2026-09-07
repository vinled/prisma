import glob
import re

for filepath in glob.glob('src/templates/*Template.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the price block
    # It usually looks like:
    #          {details.price?.trim() && (
    #            <div className={`whitespace-nowrap ${aspectRatio === 'story' ? 'text-7xl mb-[32px]' : 'text-[86px] mb-[16px]'} font-[900] text-white text-left tracking-tight drop-shadow-lg`}>
    #              {details.price}
    #            </div>
    #          )}
    # Let's extract the className.

    pattern = re.compile(r'\{details\.price\?\.trim\(\) && \(\s*<div className=\{`([^`]+)`\}>\s*\{details\.price\}\s*</div>\s*\)\}', re.MULTILINE)
    
    match = pattern.search(content)
    if match:
        class_name = match.group(1)
        new_component = f'<PriceDisplay details={{details}} aspectRatio={{aspectRatio}} baseSizeClassName="{class_name}" />'
        content = content[:match.start()] + new_component + content[match.end():]
        
        # Add import if not present
        if 'PriceDisplay' not in content:
            import_statement = "import { PriceDisplay } from './PriceDisplay';\n"
            content = content.replace("import React", import_statement + "import React")
        
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        # Elegant template is slightly different maybe?
        print(f"Could not find exact match in {filepath}")

