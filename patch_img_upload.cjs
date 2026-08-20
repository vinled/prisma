const fs = require('fs');
let code = fs.readFileSync('src/components/ImageUploader.tsx', 'utf8');

const startStr = "const processFiles = async (files: File[]) => {";
const endStr = "  const handleFileChange = useCallback(";

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const oldBlock = code.substring(startIdx, endIdx);
  
  const newBlock = `const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    
    try {
      const newImagesUrls: string[] = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = \`\${Date.now()}_\${Math.random().toString(36).substring(7)}.\${fileExt}\`;
        
        const { error: uploadError } = await supabase.storage
          .from('fotos_imoveis')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error("Erro ao fazer upload:", uploadError);
          continue;
        }
        
        const { data } = supabase.storage.from('fotos_imoveis').getPublicUrl(filePath);
        newImagesUrls.push(data.publicUrl);
      }
      
      const combinedImages = [...images, ...newImagesUrls].slice(0, 10);
      onImagesChange(combinedImages);
    } catch (err) {
      console.error("Erro inesperado no upload", err);
    } finally {
      setIsUploading(false);
    }
  };

`;
  code = code.replace(oldBlock, newBlock);
}

// Remove loadingMsg state
code = code.replace("  const [loadingMsg, setLoadingMsg] = useState('Enviando fotos...');\n", "");
code = code.replace("{isUploading ? loadingMsg : 'Clique ou arraste imagens'}", "{isUploading ? 'Enviando fotos...' : 'Clique ou arraste imagens'}");

// Revert accept attribute
code = code.replace('accept="image/*,.heic,.HEIC"', 'accept="image/jpeg, image/png, image/webp"');

// Revert drag & drop filtering
code = code.replace(
  "const imageFiles = files.filter(file => file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic'));",
  "const imageFiles = files.filter(file => file.type.startsWith('image/'));"
);

fs.writeFileSync('src/components/ImageUploader.tsx', code);
