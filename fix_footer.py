import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_footer = '<footer className="text-center py-6 text-sm text-gray-500 dark:text-zinc-400 mt-auto border-t border-gray-100 dark:border-zinc-800">'
new_footer = '<footer className={`text-center py-6 text-sm text-gray-500 dark:text-zinc-400 mt-auto border-t border-gray-100 dark:border-zinc-800 ${mobileViewTab === "preview" ? "hidden lg:block" : ""}`}>'

content = content.replace(old_footer, new_footer)

with open('src/App.tsx', 'w') as f:
    f.write(content)

