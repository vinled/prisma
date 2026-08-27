import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add backgroundColor to options
old_options = """const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale
      };"""

new_options = """const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale,
        backgroundColor: 'rgba(0,0,0,0)'
      };"""

content = content.replace(old_options, new_options)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updated htmlToImage options")
