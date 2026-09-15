import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. First wrapping div padding
old_wrap1 = 'className="flex flex-1 overflow-y-auto z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center"'
new_wrap1 = 'className="flex flex-1 overflow-y-auto z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-0 sm:-mx-6 sm:px-0 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center"'

# 2. Second wrapping div padding
old_wrap2 = 'className="flex flex-1 h-full items-center justify-center w-full max-w-md mx-auto bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200 overflow-hidden"'
new_wrap2 = 'className="flex flex-1 h-full items-center justify-center w-full max-w-full lg:max-w-md mx-auto bg-gray-100 dark:bg-zinc-950 lg:rounded-xl relative p-0 lg:p-4 transition-colors duration-200 overflow-hidden"'

content = content.replace(old_wrap1, new_wrap1)
content = content.replace(old_wrap2, new_wrap2)

with open('src/App.tsx', 'w') as f:
    f.write(content)

