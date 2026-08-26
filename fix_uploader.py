import re

with open('src/components/ImageUploader.tsx', 'r') as f:
    content = f.read()

# Add import for image compression
content = "import imageCompression from 'browser-image-compression';\n" + content

old_process = """  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    setLoadingMsg('Preparando imagens...');
    
    try {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
            try {
              setLoadingMsg('Otimizando foto do iPhone...');
              const heic2any = (await import('heic2any')).default;
              const conversionResult = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
              const singleBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
              const newFile = new File([singleBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
              
              // Instead of adding preview property (which is hard to type here since it's just File), we'll map to objectUrl later, or do it exactly as user asked
              return Object.assign(newFile, { preview: URL.createObjectURL(newFile) });
            } catch (error) {
              console.error("Erro no heic2any:", error);
              alert("O formato desta foto da Apple não é suportado no navegador. Por favor, converta para JPG ou envie pelo celular.");
              return null; 
            }
          }
          
          return Object.assign(file, { preview: URL.createObjectURL(file) });
        })
      );"""

new_process = """  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    setLoadingMsg('Preparando imagens...');
    
    try {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          let currentFile = file;
          
          if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
            try {
              setLoadingMsg('Otimizando foto do iPhone...');
              const heic2any = (await import('heic2any')).default;
              const conversionResult = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
              const singleBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
              currentFile = new File([singleBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
            } catch (error) {
              console.error("Erro no heic2any:", error);
              alert("O formato desta foto da Apple não é suportado no navegador. Por favor, converta para JPG ou envie pelo celular.");
              return null; 
            }
          }
          
          try {
             setLoadingMsg('Comprimindo imagens...');
             const options = {
               maxSizeMB: 1,
               maxWidthOrHeight: 1920,
               useWebWorker: true,
               initialQuality: 0.8
             };
             const compressedBlob = await imageCompression(currentFile, options);
             const compressedFile = new File([compressedBlob], currentFile.name, { type: compressedBlob.type });
             return Object.assign(compressedFile, { preview: URL.createObjectURL(compressedFile) });
          } catch (compressError) {
             console.error("Erro ao comprimir imagem:", compressError);
             return Object.assign(currentFile, { preview: URL.createObjectURL(currentFile) }); // fallback to original
          }
        })
      );"""

content = content.replace(old_process, new_process)

with open('src/components/ImageUploader.tsx', 'w') as f:
    f.write(content)
