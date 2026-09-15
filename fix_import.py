import re

with open('src/components/TemplateRenderer.tsx', 'r') as f:
    content = f.read()

import_old = "import { MinimalistTemplate } from '../templates/MinimalistTemplate';"
import_new = "import { MinimalistTemplate } from '../templates/MinimalistTemplate';\nimport { MyWayTemplate } from '../templates/MyWayTemplate';"
content = content.replace(import_old, import_new)

with open('src/components/TemplateRenderer.tsx', 'w') as f:
    f.write(content)
