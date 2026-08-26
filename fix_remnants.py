import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix init
start = "const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(() => {"
end = "return [];\n  });"
if start in content and end in content:
    start_idx = content.find(start)
    end_idx = content.find(end, start_idx) + len(end)
    content = content[:start_idx] + "const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);" + content[end_idx:]

# Fix handleDelete
start2 = "const handleDelete = (id: string) => {"
end2 = "};"

idx = content.find(start2)
end_idx2 = content.find(end2, idx) + len(end2)
old_handle_delete = content[idx:end_idx2]

new_handle_delete = """const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta arte?')) {
      const updated = savedProperties.filter(p => p.id !== id);
      setSavedProperties(updated);
      
      if (session?.user) {
        const { error } = await supabase.from('properties').delete().eq('id', id).eq('user_id', session.user.id);
        if (error) console.error("Erro ao deletar:", error);
      }
    }
  };"""

content = content.replace(old_handle_delete, new_handle_delete)

with open('src/App.tsx', 'w') as f:
    f.write(content)

