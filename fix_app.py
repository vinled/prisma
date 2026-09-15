import re

with open('src/App_backup.tsx', 'r') as f:
    lines = f.readlines()

# First, let's remove ALL `const renderStyleControls = () => (` definitions and their bodies up to `  );`
# The definition looks like:
#   const renderStyleControls = () => (
#     <>
#       <section ...>
#       ...
#     </>
#   );

new_lines = []
skip = False

for line in lines:
    if line.strip() == "const renderStyleControls = () => (":
        skip = True
        continue
    
    if skip and line.strip() == ");":
        # Check if the previous line was </>, if so this is the end of the component
        if len(new_lines) > 0 and new_lines[-1].strip() == "</>":
            pass # Wait, if I'm skipping I don't append to new_lines
        
        # We need to know when the component ends. It ends at `  );`
        skip = False
        continue
        
    if skip:
        continue
        
    new_lines.append(line)

with open('src/App_cleaned.tsx', 'w') as f:
    f.writelines(new_lines)

