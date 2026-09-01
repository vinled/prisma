import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# First, let's locate the existing button.
# It starts around <button onClick={() => { if (window.innerWidth < 768) { handleShare(); } else { handleDownload(); } }}
# We'll split it into a Desktop button (hidden on mobile) and a Mobile button group (hidden on desktop).

old_button_pattern = r'''<button[^>]*onClick=\{\(\) => \{\s*if \(window\.innerWidth < 768\) \{\s*handleShare\(\);\s*\} else \{\s*handleDownload\(\);\s*\}\s*\}\}[^>]*className="absolute bottom-4 right-4[^"]*"[^>]*>.*?<\/button>'''

import re
match = re.search(old_button_pattern, content, re.DOTALL)
if match:
    print("Found the button!")
else:
    print("Button not found. Trying a different pattern.")
