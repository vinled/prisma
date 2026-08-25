import re

with open('src/components/Auth.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"',
    'className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"'
)

content = content.replace(
    'className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"',
    'className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"'
)

content = content.replace(
    'className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"',
    'className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"'
)

with open('src/components/Auth.tsx', 'w') as f:
    f.write(content)
