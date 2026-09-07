import glob
import re

for filepath in glob.glob('src/templates/*Template.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace baseSizeClassName="..." with baseSizeClassName={`...`}
    # Need to be careful because some might have inner quotes, but the inner quotes are single quotes.
    # The regex could be: baseSizeClassName="([^"]+)" -> baseSizeClassName={`\1`}
    content = re.sub(r'baseSizeClassName="([^"]+)"', r'baseSizeClassName={`\1`}', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
