import glob

for filepath in glob.glob('src/templates/*Template.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()

    if 'PriceDisplay' in content and 'import { PriceDisplay }' not in content:
        content = content.replace("import React", "import React;\nimport { PriceDisplay } from './PriceDisplay'", 1)
        with open(filepath, 'w') as f:
            f.write(content)
