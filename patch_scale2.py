with open('src/App.tsx', 'r') as f:
    content = f.read()

old_val = "const maxDesktopHeight = window.innerHeight - 180;"
new_val = "const maxDesktopHeight = window.innerHeight - 240;"
content = content.replace(old_val, new_val)

with open('src/App.tsx', 'w') as f:
    f.write(content)
