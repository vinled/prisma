import React, { useCallback } from 'react';
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
        const reader = new FileReader();
        reader.onloadend = () => {
          onLogoChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onLogoChange]
  );

  return (
    <div className="w-full mt-6 pt-6 border-t border-gray-100">
      <label className="block text-sm font-medium text-gray-700 mb-2">Logo da Imobiliária (Opcional)</label>
      {logo ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-4 h-32">
          <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
          <button
            onClick={() => onLogoChange(null)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <Upload className="w-6 h-6 mb-2 text-gray-400" />
            <p className="mb-1 text-sm text-gray-500">
              Upload do logo
            </p>
            <p className="text-xs text-gray-400">Fundo transparente recomendado (PNG)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
}
