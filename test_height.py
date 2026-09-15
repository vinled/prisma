import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Let's remove the wrapper div that might be cutting it off.
# Replace `<div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-full">`
# with `<div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-auto min-h-[400px]">`

old_inner = """                {images.length > 0 ? (
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-full">"""
new_inner = """                {images.length > 0 ? (
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-auto min-h-[500px]">"""

content = content.replace(old_inner, new_inner)

with open('src/App.tsx', 'w') as f:
    f.write(content)
