import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Let's target the whole line containing Preview Side wrapper
old_line_pattern = re.compile(r'\{\/\* Preview Side \*\/\}\n\s*<div className=\{\`\$\{mobileViewTab === \'preview\' \? .*?min-w-0\`\}>')

new_line = """{/* Preview Side */}
          <div className={`${mobileViewTab === 'preview' ? 'flex flex-col h-[calc(100dvh-120px)] sm:h-[calc(100dvh-140px)] -mx-4 sm:-mx-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)]' : 'hidden'} lg:mx-0 lg:flex lg:flex-col lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start lg:w-full min-w-0`}>"""

content = old_line_pattern.sub(new_line, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

