import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# I will find the left column end, and right column start and end.
# I just need to extract the leftover block that was meant to be moved, delete it from the preview side, and inject it in the controls side.

# The block that was left over in the right column (Preview side):
leftover_pattern = re.compile(r'\s*\)\}\s*</section>\s*\{\/\* Smart Caption Module \*\/.*?</div>\s*</div>\s*</div>', re.DOTALL)
match = leftover_pattern.search(content)

if match:
    leftover_content = match.group(0)
    # Remove it from the file
    content = content.replace(leftover_content, '')
    
    # We also need to add the `)} \n </section>` and the Smart Caption module right where we previously inserted the `Estilo` section.
    # We inserted `Estilo` right before `{/* Mobile Form Actions */}`.
    # Let's find `Estilo` section end inside the Controls side.
    # It ends with:
    #                   </div>
    #                 </div>
    #             {/* Mobile Form Actions */}
    
    target_pattern = re.compile(r'(\s*<label>Tamanho do Logo</label>.*?</div>\s*</div>)(\s*\{\/\* Mobile Form Actions \*\/)', re.DOTALL)
    
    # Actually, we can just replace `{/* Mobile Form Actions */}` with our leftover_content + Mobile Form Actions
    # But wait, leftover content has `</div></div></div>` at the end which we might not want. Let's look at what leftover_content actually is.
