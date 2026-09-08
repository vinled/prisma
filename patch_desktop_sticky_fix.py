with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Un-sticky the Header Card
old_prev_wrapper = 'className="lg:sticky lg:top-6 z-[60] bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative"'
new_prev_wrapper = 'className="bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative"'
content = content.replace(old_prev_wrapper, new_prev_wrapper)

# 2. Sticky the Preview Area on Desktop
old_preview_area = 'className="sticky top-0 z-[50] bg-gray-50 dark:bg-zinc-950 lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-0 lg:mx-0"'
new_preview_area = 'className="sticky top-0 z-[50] bg-gray-50 dark:bg-zinc-950 lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:sticky lg:top-6 lg:z-[60] lg:p-0 lg:mx-0"'
content = content.replace(old_preview_area, new_preview_area)

with open('src/App.tsx', 'w') as f:
    f.write(content)
