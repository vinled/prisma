with open('src/components/LogoUploader.tsx', 'r') as f:
    content = f.read()

import_statement = "import { Upload, X, Wand2 } from 'lucide-react';"
content = content.replace("import { Upload, X } from 'lucide-react';", import_statement)

handle_bg_function = """
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveBackground = async (mode: 'black' | 'white') => {
    if (!logo) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Important for Supabase URLs
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        // Add cache-bust to avoid CORS cache issues
        img.src = logo + (logo.includes('?') ? '&' : '?') + 'cb=' + Date.now();
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      if (mode === 'black') {
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];

          if (alpha === 0) continue;

          const max = Math.max(r, g, b);
          if (max === 0) {
            data[i + 3] = 0; // Pure black becomes transparent
          } else {
            const a = max / 255;
            data[i] = Math.min(255, r / a);
            data[i + 1] = Math.min(255, g / a);
            data[i + 2] = Math.min(255, b / a);
            data[i + 3] = a * 255;
          }
        }
      } else {
        // mode === 'white'
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];

          if (alpha === 0) continue;

          const min = Math.min(r, g, b);
          const a = (255 - min) / 255;

          if (a === 0) {
            data[i + 3] = 0; // Pure white becomes transparent
          } else {
            data[i] = Math.max(0, Math.min(255, 255 - (255 - r) / a));
            data[i + 1] = Math.max(0, Math.min(255, 255 - (255 - g) / a));
            data[i + 2] = Math.max(0, Math.min(255, 255 - (255 - b) / a));
            data[i + 3] = a * 255;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to create blob');

      const fileName = `logo_${Date.now()}_bgremoved.png`;
      const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, blob, {
        contentType: 'image/png',
        upsert: false
      });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
      onLogoChange(urlData.publicUrl);
    } catch (error) {
      console.error('Erro ao remover fundo:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };
"""

content = content.replace("const handleRemove = () => {", handle_bg_function + "\n  const handleRemove = () => {")

old_render = """
      {logo ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center p-4 h-32" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)', backgroundSize: '16px 16px', backgroundPosition: '0 0, 8px 8px' }}>
          <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain relative z-10" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 z-20 bg-white dark:bg-zinc-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
          >
            <X className="w-4 h-4 text-gray-700 dark:text-zinc-300" />
          </button>
        </div>
      ) : (
"""

new_render = """
      {logo ? (
        <div className="flex flex-col gap-3">
          <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center p-4 h-32" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)', backgroundSize: '16px 16px', backgroundPosition: '0 0, 8px 8px' }}>
            <img src={logo} alt="Logo" className={`max-h-full max-w-full object-contain relative z-10 ${isProcessing ? 'opacity-50 blur-sm' : ''}`} />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 z-20 bg-white dark:bg-zinc-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
              disabled={isProcessing}
            >
              <X className="w-4 h-4 text-gray-700 dark:text-zinc-300" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => handleRemoveBackground('black')}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Remover fundo Preto
            </button>
            <button
              type="button"
              onClick={() => handleRemoveBackground('white')}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5 text-gray-500" />
              Remover fundo Branco
            </button>
          </div>
        </div>
      ) : (
"""

content = content.replace(old_render, new_render)

with open('src/components/LogoUploader.tsx', 'w') as f:
    f.write(content)
