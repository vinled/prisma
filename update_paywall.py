import re

with open('src/components/PaywallModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="w-full flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-orange-600/25 mb-4"',
    'className="w-full flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-xl shadow-orange-600/25 mb-4"'
)

with open('src/components/PaywallModal.tsx', 'w') as f:
    f.write(content)
