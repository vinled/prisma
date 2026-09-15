import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# find import { ..., useState, useEffect, ... } from 'react';
content = re.sub(r'import\s+\{(.*?)\}\s+from\s+[\'"]react[\'"];', lambda m: f"import {{{m.group(1)}, useCallback}} from 'react';" if 'useCallback' not in m.group(1) else m.group(0), content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
