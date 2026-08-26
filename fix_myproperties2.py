import re

with open('src/components/MyProperties.tsx', 'r') as f:
    content = f.read()

# Desktop
old_desktop = """{property.thumbnail ? (
                            <img 
                              src={property.thumbnail} 
                              alt={title}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-zinc-700 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-zinc-700 shrink-0">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}"""
new_desktop = '<SafeImage src={property.thumbnail} alt={title} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-zinc-700 shrink-0" iconClassName="w-5 h-5 text-gray-400" />'

content = content.replace(old_desktop, new_desktop)

# Mobile
old_mobile = """{property.thumbnail ? (
                          <img
                             src={property.thumbnail}
                             alt={title}
                            className="w-16 h-16 rounded-md object-cover border border-gray-200 dark:border-zinc-700 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-zinc-700 shrink-0">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}"""

new_mobile = '<SafeImage src={property.thumbnail} alt={title} className="w-16 h-16 rounded-md object-cover border border-gray-200 dark:border-zinc-700 shrink-0" iconClassName="w-6 h-6 text-gray-400" />'
content = content.replace(old_mobile, new_mobile)

with open('src/components/MyProperties.tsx', 'w') as f:
    f.write(content)
print("Success")
