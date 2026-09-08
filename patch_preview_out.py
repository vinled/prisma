with open('src/App.tsx', 'r') as f:
    content = f.read()

# Find:
#               )}
# 
#               {/* The Preview Area */}
#               <div className="sticky top-[60px] ...

part1 = """              )}

              {/* The Preview Area */}
              <div className="sticky top-[60px] z-[50] bg-white dark:bg-[#0f111a] lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-0 lg:mx-0">"""

part1_new = """              )}
            </div>

            {/* The Preview Area */}
            <div className="sticky top-[73px] z-[50] bg-gray-50 dark:bg-zinc-950 lg:bg-transparent pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:static lg:p-0 lg:mx-0">"""

# Replace part1
content = content.replace(part1, part1_new)

# Find:
#               </p>
#             </div>
#             <section className="mt-6

part2 = """              </p>
            </div>
            <section className="mt-6"""

part2_new = """              </p>
            </div>
            <section className="mt-6"""

# Wait, if I replace part2 with part2_new, nothing happens. I need to remove one `</div>`
part2_fix = """              </p>
            </div>
            <section className="mt-6"""

part2_fix_new = """              </p>
            </div>
            <section className="mt-6"""

# Let's just do:
content = content.replace("              </p>\n            </div>\n            <section className=\"mt-6", "              </p>\n            </div>\n            <section className=\"mt-6")

# Actually, the sticky wrapper is closed by:
#               </p>
#             </div>

# And the line 992 wrapper was closed by the `</div>` before `<section>`.
# Since we moved the closing div of line 992 to ABOVE the preview area, we must REMOVE the closing div before `<section>`.

content = content.replace("              </p>\n            </div>\n            <section className=\"mt-6", "              </p>\n            </div>\n            {/* removed extra closing div */}\n            <section className=\"mt-6")

with open('src/App.tsx', 'w') as f:
    f.write(content)

