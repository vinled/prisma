with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update the Right Column Wrapper
old_col = "className={`${mobileViewTab === 'preview' ? 'block' : 'hidden'} lg:block lg:order-2 w-full max-w-full lg:space-y-6 min-w-0`}"
new_col = "className={`${mobileViewTab === 'preview' ? 'block' : 'hidden'} lg:block lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto w-full max-w-full lg:space-y-6 min-w-0 pb-10`}"
content = content.replace(old_col, new_col)

# 2. Revert the Preview Area to not be sticky on desktop, only on mobile
old_preview_area = 'className="sticky top-0 z-[50] bg-gray-50 dark:bg-zinc-950 lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:sticky lg:top-6 lg:z-[60] lg:p-0 lg:mx-0"'
new_preview_area = 'className="sticky top-0 z-[50] bg-gray-50 dark:bg-zinc-950 lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-0 lg:mx-0"'
content = content.replace(old_preview_area, new_preview_area)

with open('src/App.tsx', 'w') as f:
    f.write(content)
