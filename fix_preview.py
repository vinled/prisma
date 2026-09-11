import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update the Right Column container
old_container = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'block' : 'hidden'} lg:block lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto w-full max-w-full lg:space-y-6 min-w-0 pb-10`}>"""

new_container = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'block' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>"""

content = content.replace(old_container, new_container)

# 2. Update the Header Block (so it doesn't take space/margins unnecessarily if it's flex)
old_header = """            <div className="bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative">"""
new_header = """            <div className="shrink-0 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-t-2xl lg:shadow-sm lg:border lg:border-b-0 border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative z-20">"""
content = content.replace(old_header, new_header)

# 3. Update the Preview Area wrapper
old_preview = """            {/* The Preview Area */}
            <div className="sticky top-0 z-[50] bg-gray-50 dark:bg-zinc-950 lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-0 lg:mx-0">"""

new_preview = """            {/* The Preview Area */}
            <div className="flex-1 overflow-y-auto sticky top-0 z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl">"""

content = content.replace(old_preview, new_preview)

with open('src/App.tsx', 'w') as f:
    f.write(content)
