import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "const executeSave = async (): Promise<boolean> => {"
end_marker = "  const handleSaveOnly = async () => {"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    before = content[:start_idx + len(start_marker)]
    after = content[end_idx:]
    
    new_logic = """
    if (userPlan !== 'pro' && !idEmEdicao && savedProperties.length >= 10) {
      alert('Limite do plano Grátis atingido (10 artes). Assine o PostNaMão Pro!');
      setIsPaywallOpen(true);
      return false;
    }

    setIsExporting(true);
    const finalImages = [];
    try {
      for (const imgUrl of images) {
        if (imgUrl.startsWith('blob:') || imgUrl.startsWith('data:')) {
          try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const fileExt = blob.type.split('/')[1] || 'jpg';
            const fileName = `imovel_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('imoveis').upload(fileName, blob, {
              contentType: blob.type,
              upsert: false
            });
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('imoveis').getPublicUrl(fileName);
            finalImages.push(data.publicUrl);
          } catch (e) {
            console.error('Erro ao fazer upload da imagem:', e);
            finalImages.push(imgUrl); // Fallback to original url
          }
        } else {
          finalImages.push(imgUrl);
        }
      }
    } finally {
      setIsExporting(false);
    }
    setImages(finalImages);

    return new Promise((resolve) => {
      const finalizeSave = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        
        let finalThumbnail = finalImages[0] || undefined;
        if (finalThumbnail === undefined && idEmEdicao) {
          finalThumbnail = savedProperties.find(p => p.id === idEmEdicao)?.thumbnail;
        }
        
        const propertyData: SavedProperty = {
          id: idEmEdicao || Date.now().toString(),
          date: dateStr,
          details,
          selectedTemplate,
          aspectRatio,
          templateOptions,
          thumbnail: finalThumbnail
        };
        
        let updated;
        if (idEmEdicao) {
          updated = savedProperties.map(p => p.id === idEmEdicao ? propertyData : p);
        } else {
          updated = [propertyData, ...savedProperties];
        }
        
        setSavedProperties(updated);
        localStorage.setItem('postnamao_imoveis', JSON.stringify(updated));
        resolve(true);
      };

      finalizeSave();
    });
}
"""
    content = before + new_logic + after
    with open('src/App.tsx', 'w') as f:
        f.write(content)
        print("Success")
