const fs = require('fs');
let code = fs.readFileSync('src/components/ImageUploader.tsx', 'utf8');

// 1. Remove loadingMsg
code = code.replace("const [loadingMsg, setLoadingMsg] = useState('Enviando fotos...');\n", "");

// 2. Replace processFiles
const oldProcessFiles = `  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    setLoadingMsg('Preparando imagens...');
    
    try {
      // 1. Process HEIC files in parallel
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
            try {
              setLoadingMsg('Otimizando foto do iPhone...');
              const heic2any = (await import('heic2any')).default;
              const conversionResult = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
              
              const singleBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
              return new File([singleBlob], file.name.replace(/\\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
            } catch (e) {
              console.error("Erro ao converter HEIC", e);
              alert('Erro ao processar foto da Apple. Tente outra imagem.');
              return null; // Return null on failure
            }
          }
          return file; // Normal files pass straight through
        })
      );
      
      // Filter out failed conversions
      const validFiles = processedFiles.filter((f) => f !== null);
      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }
      
      setLoadingMsg('Enviando fotos...');
      const newImagesUrls = [];
      
      for (const file of validFiles) {
        // High-Fidelity Instant Preview (Client-side native)
        // Instant preview
        // const objectUrl = URL.createObjectURL(file);
        // newImagesUrls.push(objectUrl);
        
        // Background Supabase Upload (keeping logic intact)
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
        
        // Supabase DB logic maintained for the bucket
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
  };`;

// Wait, the regex replace for a huge block is sometimes flaky due to whitespace. Let's do it precisely via line numbers or slicing.
