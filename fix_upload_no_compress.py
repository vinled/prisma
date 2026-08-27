with open('src/components/LogoUploader.tsx', 'r') as f:
    content = f.read()

start_idx = content.find("const handleFileChange = useCallback(")
end_idx = content.find("const handleRemove = () => {")

new_handle = """const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          setIsUploading(true);
          
          // DO NOT compress logos at all. This guarantees we never lose transparency
          // regardless of browser quirks or file.type inconsistencies.
          
          const fileExt = file.name.split('.').pop()?.toLowerCase();
          const isPng = fileExt === 'png' || file.type.includes('png');
          const finalExt = isPng ? 'png' : (fileExt || 'jpg');
          
          const fileName = `logo_${Date.now()}_${Math.random().toString(36).substring(7)}.${finalExt}`;
          
          const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, file, {
            contentType: file.type || (isPng ? 'image/png' : 'image/jpeg'),
            upsert: false
          });
          
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
          onLogoChange(data.publicUrl);
        } catch (error) {
          console.error('Erro no upload do logo:', error);
          alert('Erro ao enviar o logo. Tente novamente.');
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onLogoChange]
  );

  """

content = content[:start_idx] + new_handle + content[end_idx:]

with open('src/components/LogoUploader.tsx', 'w') as f:
    f.write(content)
