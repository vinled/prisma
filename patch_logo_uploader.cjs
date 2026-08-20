const fs = require('fs');

const code = `import React, { useCallback, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

interface LogoUploaderProps {
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
}

export function LogoUploader({ logo, onLogoChange }: LogoUploaderProps) {

  const handleFileChange = useCallback(
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
  );
  
  const handleRemove = () => {
    if (logo && logo.startsWith('blob:')) {
      URL.revokeObjectURL(logo);
    }
    onLogoChange(null);
  };

  return (
    <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Logo da Imobiliária (Opcional)</label>
      {logo ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center p-4 h-32">
          <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-white dark:bg-zinc-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
          >
            <X className="w-4 h-4 text-gray-700 dark:text-zinc-300" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-zinc-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <Upload className="w-6 h-6 mb-2 text-gray-400 dark:text-zinc-500" />
            <p className="mb-1 text-sm text-gray-500 dark:text-zinc-400">
              Upload do logo
            </p>
            <p className="text-xs text-gray-400 dark:text-zinc-500">Fundo transparente recomendado (PNG)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/LogoUploader.tsx', code);
