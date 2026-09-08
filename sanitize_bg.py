import os
import re

def sanitize_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # Find the pattern and replace it
    # We want to change: backgroundImage: `url(${image})`
    # to: backgroundImage: `url("${image?.replace(/"/g, '')}")`
    # But note that in React style object, if image is undefined, we might have issues.
    # The existing code probably has `url(${image})`.
    
    # Let's just use string replace.
    old_str = "backgroundImage: `url(${image})`"
    new_str = 'backgroundImage: `url("${image?.replace(/\\\\"/g, \\'\\')}")`'
    
    # To be safer, let's use a regex to capture exactly the interpolation.
    content = re.sub(r'backgroundImage:\s*`url\(\$\{image\}\)`', r'backgroundImage: `url("${image?.replace(/\\"/g, \'\')}")`', content)
    
    with open(path, 'w') as f:
        f.write(content)

for filename in ['ElegantTemplate.tsx', 'ModernTemplate.tsx', 'LuxuryTemplate.tsx']:
    sanitize_file(f'src/templates/{filename}')
