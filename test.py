with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace sticky top-[73px] with sticky top-0
old_str = 'className="sticky top-[73px] z-[50] bg-gray-50 dark:bg-zinc-950 lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-0 lg:mx-0"'
new_str = 'className="sticky top-0 z-[50] bg-gray-50 dark:bg-zinc-950 lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-0 lg:mx-0"'
content = content.replace(old_str, new_str)

with open('src/App.tsx', 'w') as f:
    f.write(content)
