import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap shadow-sm"',
    'className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 whitespace-nowrap shadow-sm hover:shadow-lg"'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
