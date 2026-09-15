import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_wrapper = '            <div className="sticky top-0 z-[60] w-[100vw] relative left-1/2 -translate-x-1/2 bg-gray-50 dark:bg-zinc-950 -mt-4 pt-4 pb-3 mb-6 border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 lg:hidden">'
new_wrapper = '            <div className="sticky top-0 z-[60] bg-gray-50 dark:bg-zinc-950 -mt-4 pt-4 pb-3 mb-6 border-b border-gray-200 dark:border-white/10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:hidden">'

content = content.replace(old_wrapper, new_wrapper)

with open('src/App.tsx', 'w') as f:
    f.write(content)

