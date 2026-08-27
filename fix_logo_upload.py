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
          
          let fileToUpload = file;
          
          // Only compress if it's NOT a PNG to preserve absolute transparency.
          // PNG logos are usually small enough to be uploaded directly.
          if (file.type !== 'image/png') {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 800,
              useWebWorker: true,
              alwaysKeepResolution: true
            };
            fileToUpload = await imageCompression(file, options);
          }
          
          const fileExt = file.type === 'image/png' ? 'png' : 'jpg';
          const fileName = `logo_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, fileToUpload, {
            contentType: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
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
