import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="px-4 py-2 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium rounded-lg transition-colors disabled:opacity-50"',
    'className="px-4 py-2 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"'
)

content = content.replace(
    'className="absolute bottom-4 right-4 z-10 p-3 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium md:static md:p-2 md:px-4 md:rounded-lg md:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"',
    'className="absolute bottom-4 right-4 z-10 p-3 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium md:static md:p-2 md:px-4 md:rounded-lg md:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-xl"'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
