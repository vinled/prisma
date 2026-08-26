import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

save_brandkit = """
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  
  const handleSaveBrandKit = async () => {
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
  };
"""

# Insert state
content = content.replace("const [brandKit, setBrandKit] = useState<BrandKit | null>(null);", "const [brandKit, setBrandKit] = useState<BrandKit | null>(null);\n" + save_brandkit)

old_brandkit_render = """<BrandKitForm brandKit={brandKit} onChange={setBrandKit} />
            </section>"""
new_brandkit_render = """<BrandKitForm brandKit={brandKit} onChange={setBrandKit} />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveBrandKit}
                  disabled={isSavingBrand}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-sm transition-all disabled:opacity-50"
                >
                  {isSavingBrand ? 'Salvando...' : 'Salvar Marca'}
                </button>
              </div>
            </section>"""
content = content.replace(old_brandkit_render, new_brandkit_render)

with open('src/App.tsx', 'w') as f:
    f.write(content)
