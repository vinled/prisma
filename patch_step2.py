import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# The Estilo section
estilo_start = '<section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\n              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>'
estilo_end = '              )}\n            </section>'

# Let's find it using string search
start_idx = content.find(estilo_start)
if start_idx != -1:
    end_idx = content.find(estilo_end, start_idx) + len(estilo_end)
    estilo_block = content[start_idx:end_idx]
    
    # Remove it from its original place
    content = content[:start_idx] + content[end_idx:]
    
    # We also need to remove any trailing whitespace left over, but doing it safely
    
    # Now find the place to insert it
    # We want to put it right before `{/* Smart Caption Module */}`
    insert_target = '{/* Smart Caption Module */}'
    insert_idx = content.find(insert_target)
    
    if insert_idx != -1:
        # Insert the block with a margin-bottom
        # Add 'mt-6' to the section to give it spacing from the preview box above it, or let the parent flex handle it
        estilo_block_modified = estilo_block.replace('className="bg-white dark:bg-zinc-900 p-6 rounded-2xl', 'className="mt-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl')
        
        content = content[:insert_idx] + estilo_block_modified + '\n\n            ' + content[insert_idx:]
        print("Estilo block moved successfully.")
        
        with open('src/App.tsx', 'w') as f:
            f.write(content)
    else:
        print("Smart Caption Module not found.")
else:
    print("Estilo block not found.")

