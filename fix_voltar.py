import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the Voltar button className
# Original: className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors"
# New: className="hidden lg:block px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors"

old_str = 'className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors"\n                  >\n                    Voltar'

new_str = 'className="hidden lg:block px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors"\n                  >\n                    Voltar'

content = content.replace(old_str, new_str)

with open('src/App.tsx', 'w') as f:
    f.write(content)
