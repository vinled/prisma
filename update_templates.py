import glob
import re

for filename in glob.glob('src/templates/*.tsx'):
    with open(filename, 'r') as f:
        content = f.read()

    if "options?.logoSize" in content:
        continue

    if 'ModernTemplate' in filename or 'LuxuryTemplate' in filename:
        origin = 'left top'
    else:
        origin = 'center'

    # The img tag format can vary.
    # <img src={logo} alt="Logo" className="..." /> -> 
    # <img src={logo} alt="Logo" className="..." style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: 'origin' }} />
    
    style_str = "style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: '" + origin + "' }}"
    
    pattern = r'(<img src=\{logo\} alt="Logo" className="[^"]*"[^>]*?)(\s*/?>)'
    replacement = r'\1 ' + style_str + r'\2'
    
    content = re.sub(pattern, replacement, content)

    with open(filename, 'w') as f:
        f.write(content)

print("Templates updated.")
