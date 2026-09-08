import re
with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

opens = 0
closes = 0
for i in range(855, 1232):
    opens += len(re.findall(r'<div', lines[i]))
    closes += len(re.findall(r'</div', lines[i]))

print(f"Opens: {opens}, Closes: {closes}")
