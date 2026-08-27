with open('src/components/LogoUploader.tsx', 'r') as f:
    content = f.read()

import_statement = "import imageCompression from 'browser-image-compression';\n"
if import_statement not in content:
    content = import_statement + content

# Find where handleFileChange starts and ends
start_idx = content.find("const handleFileChange = useCallback(")
end_idx = content.find("const handleRemove = () => {")

new_handle = """const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          setIsUploading(true);
          
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: 'image/png', // Forcing PNG to avoid black backgrounds on transparent logos
            alwaysKeepResolution: true
          };
          
          const compressedFile = await imageCompression(file, options);
          
          const fileName = `logo_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
          
          const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, compressedFile, {
            contentType: 'image/png',
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
