import re
import glob

templates = glob.glob('src/templates/*Template.tsx')

for template in templates:
    with open(template, 'r') as f:
        content = f.read()

    # Find the style object for the badge
    # It looks like:
    # style={{
    #   backgroundColor: (
    #       options.badge === 'VENDIDO' ? '#dc2626' : ...
    #   )
    # }}
    
    # We want to add WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' to it.
    
    if 'backgroundColor: (' in content:
        # replace `backgroundColor: (` with `WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', color: '#ffffff', backgroundColor: (`
        content = content.replace('backgroundColor: (', "WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', color: '#ffffff', backgroundColor: (")
        
    with open(template, 'w') as f:
        f.write(content)
