import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_func = """  const handleSaveBrandKit = async () => {
    if (!session?.user) return;
    setIsSavingBrand(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ brand_kit: brandKit })
        .eq('id', session.user.id);
      if (error) throw error;
      alert('Marca salva com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar a marca.');
    } finally {
      setIsSavingBrand(false);
    }
  };"""

new_func = """  const handleSaveBrandKit = async () => {
    if (!session?.user) return;
    setIsSavingBrand(true);
    try {
      const { data: profileData } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
      
      let error;
      if (profileData) {
        // Exists, update
        const { error: err } = await supabase.from('profiles').update({ brand_kit: brandKit }).eq('id', session.user.id);
        error = err;
      } else {
        // Doesn't exist, insert
        const { error: err } = await supabase.from('profiles').insert({ id: session.user.id, brand_kit: brandKit, plan: 'free' });
        error = err;
      }
      
      if (error) throw error;
      alert('Marca salva com sucesso!');
    } catch (e: any) {
      console.error(e);
      alert('Erro ao salvar a marca: ' + (e.message || 'Erro desconhecido'));
    } finally {
      setIsSavingBrand(false);
    }
  };"""

content = content.replace(old_func, new_func)

with open('src/App.tsx', 'w') as f:
    f.write(content)
