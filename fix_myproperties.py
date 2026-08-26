import re

with open('src/components/MyProperties.tsx', 'r') as f:
    content = f.read()

# Desktop Table View modification
old_desktop = """                          <SafeImage src={property.thumbnail} alt={title} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-zinc-700 shrink-0" iconClassName="w-5 h-5 text-gray-400" />
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white">{title}</span>
                            <span className="text-sm text-[#666] dark:text-zinc-400 mt-0.5">{location}</span>
                          </div>"""

new_desktop = """                          <div className="relative shrink-0">
                            <SafeImage src={property.thumbnail} alt={title} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-zinc-700" iconClassName="w-5 h-5 text-gray-400" />
                            {property.details.images && property.details.images.length > 0 && (
                              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center border border-white dark:border-zinc-800">
                                📸 {property.details.images.length}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white">{title}</span>
                            <span className="text-sm text-[#666] dark:text-zinc-400 mt-0.5">{location}</span>
                          </div>"""

content = content.replace(old_desktop, new_desktop)


# Mobile Grid View modification
old_mobile = """                      <div className="flex gap-4 items-start">
                        <SafeImage src={property.thumbnail} alt={title} className="w-16 h-16 rounded-md object-cover border border-gray-200 dark:border-zinc-700 shrink-0" iconClassName="w-6 h-6 text-gray-400" />
                        <div className="flex flex-col flex-1 min-w-0 pt-1">
                          <span className="font-bold text-gray-900 dark:text-white truncate">{title}</span>"""

new_mobile = """                      <div className="flex gap-4 items-start">
                        <div className="relative shrink-0">
                          <SafeImage src={property.thumbnail} alt={title} className="w-16 h-16 rounded-md object-cover border border-gray-200 dark:border-zinc-700" iconClassName="w-6 h-6 text-gray-400" />
                          {property.details.images && property.details.images.length > 0 && (
                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center border border-white dark:border-zinc-800">
                              📸 {property.details.images.length}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 pt-1">
                          <span className="font-bold text-gray-900 dark:text-white truncate">{title}</span>"""

content = content.replace(old_mobile, new_mobile)

with open('src/components/MyProperties.tsx', 'w') as f:
    f.write(content)
