const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Share2 to imports
code = code.replace(
  "Menu, X, PlusSquare, Palette } from 'lucide-react';",
  "Menu, X, PlusSquare, Palette, Share2 } from 'lucide-react';"
);

// 2. Add handleShare logic and update handleDownload to call handleShare if mobile.
// Let's create `handleShare` right before `handleDownload`.

const handleShareCode = `  const handleShare = async () => {
    if (!hiddenRenderersRef.current) return;
    
    const postElements = hiddenRenderersRef.current.querySelectorAll('.post-template-export');
    if (!postElements || postElements.length === 0) {
      alert('Nenhuma imagem para exportar.');
      return;
    }

    try {
      setIsExporting(true);
      await executeSave();
      
      const scale = 1; 
      const baseWidth = 1080;
      const baseHeight = aspectRatio === 'story' ? 1920 : 1080;
      
      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale
      };

      const dataUrl = await htmlToImage.toPng(postElements[0], options);
      
      // Attempt to share
      if (navigator.share && navigator.canShare) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const imageFile = new File([blob], 'post-imovel.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [imageFile] })) {
            if (generatedCaption) {
              await navigator.clipboard.writeText(generatedCaption);
              alert('Legenda copiada! Escolha onde compartilhar.');
            }
            await navigator.share({
              files: [imageFile],
              title: 'Post Prisma'
            });
            return;
          }
        } catch (shareError) {
          console.error("Share failed", shareError);
        }
      }
      
      // Fallback: download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = \`post-imovel-1.png\`;
      link.click();
    } catch (error) {
      console.error('Erro na exportação:', error);
      alert('Ocorreu um erro ao gerar a imagem.');
    } finally {
      setIsExporting(false);
    }
  };

`;

code = code.replace(
  "const handleDownload = async () => {",
  handleShareCode + "const handleDownload = async () => {"
);

// We need to modify the button's onClick to call handleShare on mobile?
// Wait, the user said:
// "Se suportado (Mobile), chame await navigator.share... Se não for suportado (Desktop), execute a lógica antiga de forçar o download automático da imagem."
// So `handleShare` can just *replace* the onClick of the button, and handle the fallback internally?
// But wait! `handleDownload` handles ZIP files for multiple images. Let's adapt `handleShare` to fall back to `handleDownload` if multiple images, OR just let `handleShare` handle the first image as requested by the user, but what if there are multiple images? 
// Let's look at `handleDownload` again.

fs.writeFileSync('src/App.tsx', code);
