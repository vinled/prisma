import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace executeSave
old_finalize_save = """        setSavedProperties(updated);
        localStorage.setItem('postnamao_imoveis', JSON.stringify(updated));
        resolve(true);
      };

      finalizeSave();
    });"""

new_finalize_save = """        setSavedProperties(updated);
        
        // Save to Supabase
        if (session?.user) {
          supabase.from('properties').upsert({
            id: propertyData.id,
            user_id: session.user.id,
            date: propertyData.date,
            details: propertyData.details,
            selected_template: propertyData.selectedTemplate,
            aspect_ratio: propertyData.aspectRatio,
            template_options: propertyData.templateOptions,
            thumbnail: propertyData.thumbnail
          }).then(({ error }) => {
            if (error) console.error("Erro ao salvar no banco:", error);
          });
        }
        
        resolve(true);
      };

      finalizeSave();
    });"""

content = content.replace(old_finalize_save, new_finalize_save)

# Replace handleDelete
old_handle_delete = """  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta arte?')) {
      const updated = savedProperties.filter(p => p.id !== id);
      setSavedProperties(updated);
      localStorage.setItem('postnamao_imoveis', JSON.stringify(updated));
    }
  };"""

new_handle_delete = """  const handleDelete = async (id: string) => {
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
