const fs = require('fs');
let code = fs.readFileSync('src/components/ImageUploader.tsx', 'utf8');

const processFilesStart = `  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    
    try {
      const newImagesUrls: string[] = [];
      
      for (const file of files) {`;

const processFilesNew = `  const [loadingMsg, setLoadingMsg] = useState('Enviando fotos...');

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    
    try {
      const newImagesUrls: string[] = [];
      
      for (let file of files) {
        if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
          try {
            setLoadingMsg('Otimizando foto do iPhone...');
            const heic2any = (await import('heic2any')).default;
            const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
            
            // heic2any can return an array of blobs if it's a sequence, we take the first one or just cast
            const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            
            file = new File([finalBlob], file.name.replace(/\\.heic$/i, '.jpg'), { type: 'image/jpeg' });
            setLoadingMsg('Enviando fotos...');
          } catch (e) {
            console.error("Erro ao converter HEIC", e);
            continue;
          }
        }`;

code = code.replace(processFilesStart, processFilesNew);

code = code.replace(
  "const imageFiles = files.filter(file => file.type.startsWith('image/'));",
  "const imageFiles = files.filter(file => file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic'));"
);

code = code.replace(
  "accept=\"image/*\"",
  "accept=\"image/*,.heic,.HEIC\""
);

code = code.replace(
  "{isUploading ? 'Enviando fotos...' : 'Clique ou arraste imagens'}",
  "{isUploading ? loadingMsg : 'Clique ou arraste imagens'}"
);

fs.writeFileSync('src/components/ImageUploader.tsx', code);
