import React, { useCallback, useState, useEffect } from 'react';
import { Upload, X, Camera } from 'lucide-react';
// import { supabase } from '../lib/supabase'; // Removed as per instructions

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Enviando fotos...');

  // Optional: Cleanup on unmount (note: since images are used outside, we should be careful. We revoke when removing an image explicitly).
  useEffect(() => {
    return () => {
      // We don't revoke on unmount because the canvas might still need them in another view.
      // But we will revoke when removed by the user in removeImage.
    };
  }, []);

  const processFiles = async (files: File[]) => {
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
      );

      const validFiles = processedFiles.filter(f => f !== null);
      
      const newImagesUrls = validFiles.map((f: any) => f.preview);
      const combinedImages = [...images, ...newImagesUrls].slice(0, 10);
      onImagesChange(combinedImages);
    } catch (err) {
      console.error("Erro inesperado no upload", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []) as File[];
      processFiles(files);
    },
    [images, onImagesChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    const imageFiles = files.filter(file => file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic'));
    processFiles(imageFiles);
  };

  const removeImage = (indexToRemove: number) => {
    const imgToRemove = images[indexToRemove];
    if (imgToRemove && imgToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imgToRemove);
    }
    onImagesChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video">
              <img src={image} alt={`Imóvel ${index + 1}`} className="w-full h-full object-cover" onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  target.nextElementSibling.classList.remove('hidden');
                }
              }} />
              <div className="hidden w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {images.length < 10 && (
        <label 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-6 h-6 mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500'}`} />
            <p className="mb-1 text-sm text-gray-500 dark:text-zinc-400 text-center px-4">
              <span className="font-semibold text-gray-700 dark:text-zinc-300">
                {isUploading ? loadingMsg : 'Clique ou arraste imagens'}
              </span>
              {!isUploading && <><br/>(até 10 fotos)</>}
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} disabled={isUploading} />
        </label>
      )}
    </div>
  );
}
