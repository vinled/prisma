import React, { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X } from 'lucide-react';

interface LogoUploaderProps {
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
}

export function LogoUploader({ logo, onLogoChange }: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          setIsUploading(true);
          
          // UPLOAD NATIVO E DIRETO.
          // Nenhuma biblioteca de compressão ou conversão será chamada.
          // A imagem crua e original é enviada para garantir que o Alpha/Transparência não seja perdido.
          
          const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
          const isPng = fileExt === 'png' || file.type.includes('png');
          
          const fileName = `logo_${Date.now()}_${Math.random().toString(36).substring(7)}.${isPng ? 'png' : fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, file, {
            contentType: isPng ? 'image/png' : (file.type || 'image/jpeg'),
            upsert: false,
            cacheControl: '3600'
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

  const handleRemove = () => {
    onLogoChange(null);
  };

  return (
    <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Logo da Imobiliária (Opcional)</label>
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
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-zinc-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <Upload className="w-6 h-6 mb-2 text-gray-400 dark:text-zinc-500" />
            <p className="mb-1 text-sm text-gray-500 dark:text-zinc-400">
              {isUploading ? "Enviando..." : "Upload do logo"}
            </p>
            <p className="text-xs text-gray-400 dark:text-zinc-500">Fundo transparente recomendado (PNG)</p>
          </div>
          <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
}
