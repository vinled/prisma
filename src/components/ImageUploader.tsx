import imageCompression from 'browser-image-compression';
import React, { useCallback, useState, useEffect } from 'react';
import { Upload, X, Camera, Star, Plus } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  previewIndex?: number;
  onSelectPreviewIndex?: (index: number) => void;
}

export function ImageUploader({ 
  images, 
  onImagesChange, 
  previewIndex = 0, 
  onSelectPreviewIndex 
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Enviando fotos...');

  useEffect(() => {
    return () => {
      // images cleanup handled externally
    };
  }, []);

  const processFiles = async (files: File[]) => {
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
            } catch (error: any) {
              console.error("Erro no heic2any:", error);
              if (error?.code === 2 || file.type === 'image/jpeg' || file.type === 'image/png') {
                 console.log("Tentando fallback para compressão normal...");
              } else {
                 alert("O formato desta foto da Apple não é suportado no navegador. Por favor, converta para JPG ou envie pelo celular.");
                 return null; 
              }
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
             return Object.assign(currentFile, { preview: URL.createObjectURL(currentFile) });
          }
        })
      );

      const validFiles = processedFiles.filter(f => f !== null);
      const newImagesUrls = validFiles.map((f: any) => f.preview);
      const combinedImages = [...images, ...newImagesUrls].slice(0, 10);
      onImagesChange(combinedImages);
      
      // If adding first photos, make sure index 0 is selected
      if (images.length === 0 && combinedImages.length > 0 && onSelectPreviewIndex) {
        onSelectPreviewIndex(0);
      }
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
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
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
    const newImgs = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImgs);
    if (previewIndex >= newImgs.length && onSelectPreviewIndex) {
      onSelectPreviewIndex(Math.max(0, newImgs.length - 1));
    }
  };

  const setAsPrimary = (indexToPromote: number) => {
    if (indexToPromote === 0) return;
    const item = images[indexToPromote];
    const remaining = images.filter((_, idx) => idx !== indexToPromote);
    const updated = [item, ...remaining];
    onImagesChange(updated);
    if (onSelectPreviewIndex) {
      onSelectPreviewIndex(0);
    }
  };

  return (
    <div className="w-full">
      {/* Upload zone when no images */}
      {images.length === 0 && (
        <label 
          className={`flex flex-col items-center justify-center w-full min-h-[160px] sm:min-h-[190px] border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 p-6 text-center group ${
            isDragging 
              ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/30 scale-[1.01]' 
              : 'border-orange-200 dark:border-zinc-700 bg-orange-50/30 dark:bg-zinc-800/40 hover:bg-orange-50/60 dark:hover:bg-zinc-800/80 hover:border-orange-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Camera className="w-7 h-7" />
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
            {isUploading ? loadingMsg : 'Adicionar fotos do imóvel'}
          </span>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-sm">
            Arraste aqui ou toque para escolher da galeria ou câmera (até 10 fotos)
          </p>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange} 
            disabled={isUploading} 
          />
        </label>
      )}

      {/* Grid when images exist */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
            <span>
              <strong>{images.length}</strong> de 10 fotos adicionadas
            </span>
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              A foto 1 é a capa do post
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => {
              const isPrimary = index === 0;
              const isSelected = previewIndex === index;

              return (
                <div 
                  key={index} 
                  onClick={() => onSelectPreviewIndex?.(index)}
                  className={`relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer transition-all border-2 ${
                    isSelected 
                      ? 'border-orange-500 shadow-md ring-2 ring-orange-500/20' 
                      : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Foto ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        target.nextElementSibling.classList.remove('hidden');
                      }
                    }} 
                  />
                  <div className="hidden w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Primary Badge or Set Primary Action */}
                  {isPrimary ? (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold shadow-md flex items-center space-x-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Capa</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAsPrimary(index);
                      }}
                      className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 hover:bg-orange-600 text-white text-[10px] font-medium backdrop-blur-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Definir esta foto como a capa do post"
                    >
                      Tornar Capa
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-sm transition-colors shadow-sm"
                    title="Remover foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Photo index indicator */}
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/50 text-white text-[9px] font-mono backdrop-blur-sm">
                    #{index + 1}
                  </div>
                </div>
              );
            })}

            {/* Quick add more slot if < 10 */}
            {images.length < 10 && (
              <label 
                className="flex flex-col items-center justify-center aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-orange-400 dark:hover:border-orange-500 rounded-xl cursor-pointer bg-gray-50/50 dark:bg-zinc-800/30 hover:bg-orange-50/30 transition-colors p-2 text-center group"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-zinc-300 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors mb-1">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  {isUploading ? 'Enviando...' : '+ Mais fotos'}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  disabled={isUploading} 
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
