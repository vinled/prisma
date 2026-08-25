import re

with open('src/components/MyAccount.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="w-full py-3 px-4 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white text-center transition-colors shadow-lg shadow-orange-600/20"',
    'className="w-full py-3 px-4 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white text-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"'
)

with open('src/components/MyAccount.tsx', 'w') as f:
    f.write(content)
