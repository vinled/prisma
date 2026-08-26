import re

with open('src/types.ts', 'r') as f:
    content = f.read()

old_details = """  leisureArea: boolean | null;
  whatsapp: string;
}"""

new_details = """  leisureArea: boolean | null;
  whatsapp: string;
  images?: string[];
}"""

content = content.replace(old_details, new_details)

with open('src/types.ts', 'w') as f:
    f.write(content)
