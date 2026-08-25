import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"',
    'className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"'
)

content = content.replace(
    'className="md:hidden fixed inset-y-0 right-0 w-64 bg-white dark:bg-[#0f111a] shadow-xl z-[100] transform transition-transform flex flex-col overflow-y-auto"',
    'className="md:hidden fixed inset-y-0 right-0 w-64 bg-white dark:bg-[#0f111a] shadow-xl z-[100] transform transition-transform flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300"'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
