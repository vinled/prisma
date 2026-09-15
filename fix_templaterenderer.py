import re

with open('src/components/TemplateRenderer.tsx', 'r') as f:
    content = f.read()

import_old = "import { MinimalistTemplate } from './templates/MinimalistTemplate';"
import_new = "import { MinimalistTemplate } from './templates/MinimalistTemplate';\nimport { MyWayTemplate } from './templates/MyWayTemplate';"
content = content.replace(import_old, import_new)

switch_old = '''    case 'minimalist':
      TemplateComponent = <MinimalistTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
      break;'''
switch_new = '''    case 'minimalist':
      TemplateComponent = <MinimalistTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
      break;
    case 'myway':
      TemplateComponent = <MyWayTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
      break;'''
content = content.replace(switch_old, switch_new)

with open('src/components/TemplateRenderer.tsx', 'w') as f:
    f.write(content)

