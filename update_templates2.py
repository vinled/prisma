import glob

for filename in glob.glob('src/templates/*.tsx'):
    with open(filename, 'r') as f:
        content = f.read()

    if "options?.logoSize" in content:
        continue

    if 'ModernTemplate' in filename or 'LuxuryTemplate' in filename:
        origin = 'left top'
    else:
        origin = 'center'

    style_str = " style={{ transform: `scale(${(options?.logoSize ?? 100) / 100})`, transformOrigin: '" + origin + "' }}"
    
    # We find '<img src={logo} alt="Logo" ' and replace the ending '/>' with 'style={...} />'
    # Actually, we can just replace 'alt="Logo"' with 'alt="Logo" style={...}'
    content = content.replace('alt="Logo"', f'alt="Logo"{style_str}')

    with open(filename, 'w') as f:
        f.write(content)

print("Templates updated with alternative method.")
