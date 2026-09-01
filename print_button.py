import re
with open('src/App.tsx', 'r') as f:
    content = f.read()
old_button_pattern = r'''<button[^>]*onClick=\{\(\) => \{\s*if \(window\.innerWidth < 768\) \{\s*handleShare\(\);\s*\} else \{\s*handleDownload\(\);\s*\}\s*\}\}[^>]*className="absolute bottom-4 right-4[^"]*"[^>]*>.*?<\/button>'''
match = re.search(old_button_pattern, content, re.DOTALL)
if match:
    print(match.group(0))
