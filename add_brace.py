import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# We need to find the transition between the end of Estilo and the start of Smart Caption Module
# Estilo ends with:
#                     <input 
#                       type="range" 
#                       min="50" max="150" 
#                       value={templateOptions.logoSize ?? 100} 
#                       onChange={(e) => setTemplateOptions({...templateOptions, logoSize: Number(e.target.value)})}
#                       className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
#                     />
#                   </div>
#                 </div>

pattern = re.compile(r'(<label>Tamanho do Logo</label>.*?</div>\s*</div>)(\s*\{\/\* Smart Caption Module \*\/\})', re.DOTALL)
m = pattern.search(text)
if m:
    print("Found! Injecting )}</section>")
    new_text = text.replace(m.group(0), m.group(1) + "\n              )}\n            </section>\n" + m.group(2))
    with open('src/App.tsx', 'w') as f:
        f.write(new_text)
else:
    print("Not found! Let's check what's actually there.")
    
    # Maybe the Smart caption module is not immediately after?
    # Actually, in fix_again2.py, part2 was `text[estilo_start:smart_caption_end]`.
    # Let's just find `Tamanho do Logo` and print the following 20 lines.
