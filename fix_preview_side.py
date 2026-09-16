import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_preview = "          {/* Preview Side */}\n          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-[calc(100dvh-120px)] sm:h-[calc(100dvh-140px)] -mx-4 sm:-mx-6' : 'hidden'} lg:mx-0 lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>"
new_preview = "          {/* Preview Side */}\n          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-[calc(100dvh-120px)] sm:h-[calc(100dvh-140px)] -mx-4 sm:-mx-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)]' : 'hidden'} lg:mx-0 lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start lg:w-full max-w-none lg:max-w-full min-w-0`}>"

content = content.replace(old_preview, new_preview)

with open('src/App.tsx', 'w') as f:
    f.write(content)

