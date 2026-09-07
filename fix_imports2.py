import glob

for filepath in glob.glob('src/templates/*Template.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()

    # The broken syntax looks like:
    # import React;
    # import { PriceDisplay } from './PriceDisplay' from 'react';
    
    content = content.replace("import React;\nimport { PriceDisplay } from './PriceDisplay' from 'react';", "import React from 'react';\nimport { PriceDisplay } from './PriceDisplay';")
    
    with open(filepath, 'w') as f:
        f.write(content)
