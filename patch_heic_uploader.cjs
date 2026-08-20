const fs = require('fs');
let code = fs.readFileSync('src/components/ImageUploader.tsx', 'utf8');

// Find the start of the `processFiles` function
const startIdx = code.indexOf('const processFiles = async (files: File[]) => {');
// Find the start of the `// High-Fidelity Instant Preview (Client-side native)` comment which is the boundary
const endIdx = code.indexOf('// High-Fidelity Instant Preview (Client-side native)');

if (startIdx !== -1 && endIdx !== -1) {
  const originalBlock = code.substring(startIdx, endIdx);
  
  const newBlock = `const processFiles = async (files: File[]) => {
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
      const validFiles = processedFiles.filter((f): f is File => f !== null);
      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }
      
      setLoadingMsg('Enviando fotos...');
      const newImagesUrls: string[] = [];
      
      for (const file of validFiles) {
        `;
        
  code = code.replace(originalBlock, newBlock);
  fs.writeFileSync('src/components/ImageUploader.tsx', code);
} else {
  console.log("Could not find blocks.");
}
