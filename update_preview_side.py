import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the Preview Side and its contents.
# We will use regex to find the preview side block and carefully rewrite it to accommodate the new mobile editor.

old_preview_start = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-[calc(100dvh-12rem)]' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>
            <div className="block lg:hidden shrink-0 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
              {renderStyleControls()}
            </div>
            <div className="shrink-0 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-t-2xl lg:shadow-sm lg:border lg:border-b-0 border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative z-20">"""

# Note: The exact string might have changed a bit. Let's find it.
