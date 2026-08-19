import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    
    try {
      const newImagesUrls: string[] = [];
      
      for (const file of files) {
        // High-Fidelity Instant Preview (Client-side native)
        // Instant preview
        // const objectUrl = URL.createObjectURL(file);
        // newImagesUrls.push(objectUrl);
        
        // Background Supabase Upload (keeping logic intact)
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
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
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    processFiles(imageFiles);
  };

  const removeImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video">
              <img src={image} alt={`Imóvel ${index + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />
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
                {isUploading ? 'Enviando fotos...' : 'Clique ou arraste imagens'}
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
