import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix 1: Make sure the flex layout correctly stacks the styles and the preview on mobile.
# The `Preview Side` container
old_preview_side = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-auto min-h-[calc(100dvh-12rem)]' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>
            <div className="block lg:hidden mb-6">
              {renderStyleControls()}
            </div>
            <div className="shrink-0 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-t-2xl lg:shadow-sm lg:border lg:border-b-0 border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative z-20">"""


# Notice the extra mb-6 on the renderStyleControls block and the lack of a proper container
new_preview_side = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-auto min-h-[calc(100dvh-12rem)]' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>
            <div className="block lg:hidden shrink-0 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
              {renderStyleControls()}
            </div>
            <div className="shrink-0 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 pb-4 md:m-0 md:p-0 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-t-2xl lg:shadow-sm lg:border lg:border-b-0 border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative z-20">"""

content = content.replace(old_preview_side, new_preview_side)

# Fix 2: The preview container heights
# It currently has `min-h-[400px]`, which is fine, but maybe the scaling logic is crashing or hiding it because `previewContainerRef` is returning 0 height when it is unmounted then mounted.
# Let's ensure the inner preview container takes up a robust amount of space.

old_preview_area = """            {/* The Preview Area */}
            <div className="flex flex-1 min-h-[400px] overflow-y-auto z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-0 sm:-mx-6 sm:px-0 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center">
                <div ref={previewContainerRef} className="flex flex-1 h-full items-center justify-center w-full max-w-full lg:max-w-md mx-auto bg-gray-100 dark:bg-zinc-950 lg:rounded-xl relative p-0 lg:p-4 transition-colors duration-200 overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-full min-h-[400px]">"""

new_preview_area = """            {/* The Preview Area */}
            <div className="flex flex-1 min-h-[500px] overflow-hidden z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center relative">
                <div ref={previewContainerRef} className="flex flex-1 h-full min-h-[500px] items-center justify-center w-full max-w-full lg:max-w-md mx-auto bg-gray-100 dark:bg-zinc-950 lg:rounded-xl relative p-0 lg:p-4 transition-colors duration-200 overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-full">"""

# wait, the current code is:
current_preview_area = """            {/* The Preview Area */}
            <div className="flex flex-1 min-h-[400px] overflow-y-auto z-[10] bg-gray-50 dark:bg-zinc-950 lg:bg-white lg:dark:bg-zinc-900 pb-10 pt-2 -mx-4 px-0 sm:-mx-6 sm:px-0 lg:p-6 lg:mx-0 lg:border lg:border-t-0 border-gray-100 dark:border-zinc-800 lg:rounded-b-2xl items-center justify-center">
                <div ref={previewContainerRef} className="flex flex-1 h-full items-center justify-center w-full max-w-full lg:max-w-md mx-auto bg-gray-100 dark:bg-zinc-950 lg:rounded-xl relative p-0 lg:p-4 transition-colors duration-200 overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative mx-auto flex-shrink-0 flex items-center justify-center w-full h-full">"""

content = content.replace(current_preview_area, new_preview_area)

with open('src/App.tsx', 'w') as f:
    f.write(content)

