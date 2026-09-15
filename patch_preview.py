import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

preview_header = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-[calc(100dvh-12rem)] min-h-[400px]' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>"""

preview_header_new = """          {/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-auto' : 'hidden'} lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] self-start w-full max-w-full min-w-0`}>
            <div className="block lg:hidden mb-6">
              {renderStyleControls()}
            </div>"""

content = content.replace(preview_header, preview_header_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)

