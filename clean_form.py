with open('src/components/PropertyForm.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "{/* Dynamic Price Section */}" in line and i > 200:
        skip = True
    if skip and '      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">' in line and '<div>' in lines[i+1]:
        # we found the start of the next grid
        skip = False
    
    if not skip:
        new_lines.append(line)

with open('src/components/PropertyForm.tsx', 'w') as f:
    f.writelines(new_lines)
