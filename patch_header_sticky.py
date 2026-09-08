with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Hide the header text on mobile:
# Change: <div><h1 className="text-2xl...
# To: <div className="hidden md:block"><h1 className="text-2xl...

old_header_text = """              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>"""

new_header_text = """              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>"""

content = content.replace(old_header_text, new_header_text)

# 2. Fix Sticky Tabs Wrapper
# Currently it is: <div className="sticky top-0 z-40 bg-gray-50 dark:bg-zinc-950 pb-4 pt-2 shadow-sm -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:bg-transparent lg:shadow-none lg:p-0 flex lg:hidden mt-2">
# Let's change it exactly to what the user requested:
# sticky top-0 z-[60] w-full bg-gray-50 dark:bg-zinc-950 py-3 border-b border-white/10 (or border-gray-200)

old_sticky_wrapper = '              <div className="sticky top-0 z-40 bg-gray-50 dark:bg-zinc-950 pb-4 pt-2 shadow-sm -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:bg-transparent lg:shadow-none lg:p-0 flex lg:hidden mt-2">'
new_sticky_wrapper = '              <div className="sticky top-0 z-[60] w-full bg-gray-50 dark:bg-zinc-950 py-3 border-b border-gray-200 dark:border-white/10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:bg-transparent lg:shadow-none lg:p-0 lg:border-none flex lg:hidden mt-0">'

content = content.replace(old_sticky_wrapper, new_sticky_wrapper)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Patch 1 applied.")
