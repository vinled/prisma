import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix htmlToImage options for download
old_options = """      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale,
        backgroundColor: 'rgba(0,0,0,0)'
      };"""

new_options = """      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale,
        backgroundColor: 'rgba(0,0,0,0)',
        useCORS: true,
        allowTaint: true
      };"""

content = content.replace(old_options, new_options)

with open('src/App.tsx', 'w') as f:
    f.write(content)
