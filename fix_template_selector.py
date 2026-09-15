import re

with open('src/components/TemplateSelector.tsx', 'r') as f:
    content = f.read()

# Make the buttons just text on mobile (hidden preview on mobile, visible on md+)
old_button = """            className={`min-w-[120px] md:min-w-0 snap-center p-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center ${
              selected === tpl.id
                ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-600 text-blue-800 dark:text-blue-300 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
            }`}
          >
            {tpl.preview}
            {tpl.name}
          </button>"""

new_button = """            className={`shrink-0 snap-center px-4 py-2 md:p-2 rounded-full md:rounded-xl text-sm md:text-xs font-medium transition-all flex flex-col items-center justify-center ${
              selected === tpl.id
                ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-600 text-blue-800 dark:text-blue-300 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
            }`}
          >
            <div className="hidden md:block w-full">
              {tpl.preview}
            </div>
            <span>{tpl.name}</span>
          </button>"""

content = content.replace(old_button, new_button)

with open('src/components/TemplateSelector.tsx', 'w') as f:
    f.write(content)

