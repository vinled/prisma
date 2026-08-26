import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "const response = await fetch('/api/generate-caption', {"
end_marker = "});"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    before = content[:start_idx]
    after = content[end_idx + len(end_marker):]

    new_fetch = """
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token;
      
      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promptText })
      });"""

    content = before + new_fetch.strip() + after
    with open('src/App.tsx', 'w') as f:
        f.write(content)
        print("Updated App.tsx")
else:
    print("Failed to find fetch in App.tsx")
