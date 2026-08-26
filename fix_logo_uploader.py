import re

with open('src/components/LogoUploader.tsx', 'r') as f:
    content = f.read()

# Make sure supabase is imported
if "import { supabase }" not in content:
    content = content.replace("import React, { useCallback, useEffect } from 'react';", "import React, { useCallback, useState } from 'react';\nimport { supabase } from '../lib/supabase';")

old_handle = """  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (logo && logo.startsWith('blob:')) {
          URL.revokeObjectURL(logo);
        }
        const objectUrl = URL.createObjectURL(file);
        onLogoChange(objectUrl);
      }
    },
    [logo, onLogoChange]
  );"""

new_handle = """  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          setIsUploading(true);
          const fileExt = file.type.split('/')[1] || 'png';
          const fileName = `logo_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('imoveis').upload(fileName, file, {
            contentType: file.type,
            upsert: false
          });
          
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage.from('imoveis').getPublicUrl(fileName);
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
  );"""

content = content.replace(old_handle, new_handle)

# We should also replace the label to show 'Enviando...'
content = content.replace('Upload do logo', '{isUploading ? "Enviando..." : "Upload do logo"}')

with open('src/components/LogoUploader.tsx', 'w') as f:
    f.write(content)
