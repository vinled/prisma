import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove lg:sticky lg:top-6 lg:self-start from the right column wrapper
old_col = "className={`${mobileViewTab === 'preview' ? 'block' : 'hidden'} lg:block lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full lg:space-y-6 min-w-0`}"
new_col = "className={`${mobileViewTab === 'preview' ? 'block' : 'hidden'} lg:block lg:order-2 w-full max-w-full lg:space-y-6 min-w-0`}"
content = content.replace(old_col, new_col)

# 2. Add lg:sticky lg:top-6 z-[60] to the Preview wrapper block
old_prev_wrapper = 'className="bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative"'
new_prev_wrapper = 'className="lg:sticky lg:top-6 z-[60] bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative"'
content = content.replace(old_prev_wrapper, new_prev_wrapper)

with open('src/App.tsx', 'w') as f:
    f.write(content)
