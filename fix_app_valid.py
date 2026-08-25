import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("  if (!session) {", "  const isValidSession = session && session.user && session.user.email;\n\n  if (!isValidSession) {")

with open('src/App.tsx', 'w') as f:
    f.write(content)
