import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_executesave = """  const executeSave = async (): Promise<boolean> => {
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
    });
}"""

new_executesave = """  const executeSave = async (): Promise<boolean> => {
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
            const { error: uploadError } = await supabase.storage.from('fotos_imoveis').upload(fileName, blob, {
              contentType: blob.type,
              upsert: false
            });
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('fotos_imoveis').getPublicUrl(fileName);
            finalImages.push(data.publicUrl);
          } catch (e) {
            console.error('Erro ao fazer upload da imagem:', e);
            // Fallback: If upload fails, keep original url so it doesn't break UI immediately,
            // but it won't be a valid permanent public URL.
            finalImages.push(imgUrl); 
          }
        } else {
          finalImages.push(imgUrl);
        }
      }
      
      setImages(finalImages);

      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      
      let finalThumbnail = finalImages[0] || undefined;
      // Guarantee we don't save blob: in DB for thumbnail
      if (finalThumbnail && finalThumbnail.startsWith('blob:')) {
         finalThumbnail = undefined; // Don't save temporary blob URL to DB
      }
      
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
      
      // Await Save to Supabase
      if (session?.user) {
        const { error } = await supabase.from('properties').upsert({
          id: propertyData.id,
          user_id: session.user.id,
          date: propertyData.date,
          details: propertyData.details,
          selected_template: propertyData.selectedTemplate,
          aspect_ratio: propertyData.aspectRatio,
          template_options: propertyData.templateOptions,
          thumbnail: propertyData.thumbnail
        });
        if (error) {
          console.error("Erro ao salvar no banco:", error);
          alert("Aviso: Falha ao sincronizar com a nuvem.");
        }
      }
      return true;
    } catch (err) {
      console.error("Execute save erro geral:", err);
      return false;
    } finally {
      setIsExporting(false);
    }
  };"""

content = content.replace(old_executesave, new_executesave)
with open('src/App.tsx', 'w') as f:
    f.write(content)
