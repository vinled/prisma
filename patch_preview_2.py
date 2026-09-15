import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

preview_header_new = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-auto' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>"""

preview_header_fixed = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-auto min-h-[calc(100dvh-12rem)]' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>"""

content = content.replace(preview_header_new, preview_header_fixed)

preview_area = """            {/* The Preview Area */}
            <div className="flex flex-1 overflow-y-auto z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-0 sm:-mx-6 sm:px-0 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center">"""

preview_area_fixed = """            {/* The Preview Area */}
            <div className="flex flex-1 min-h-[400px] overflow-y-auto z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-0 sm:-mx-6 sm:px-0 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center">"""

content = content.replace(preview_area, preview_area_fixed)

with open('src/App.tsx', 'w') as f:
    f.write(content)

