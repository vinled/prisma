import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove JSZip and file-saver imports
content = content.replace("import JSZip from 'jszip';\n", "")
content = content.replace("import { saveAs } from 'file-saver';\n", "")

# 2. Add exportProgressText state
state_search = "const [isExporting, setIsExporting] = useState(false);"
state_replace = "const [isExporting, setIsExporting] = useState(false);\n  const [exportProgressText, setExportProgressText] = useState<string | null>(null);"
content = content.replace(state_search, state_replace)

# 3. Rewrite handleDownload
old_download_func = """const handleDownload = async () => {
    if (!hiddenRenderersRef.current) return;
    
    const postElements = hiddenRenderersRef.current.querySelectorAll('.post-template-export');
    if (!postElements || postElements.length === 0) {
      alert('Nenhuma imagem para exportar.');
      return;
    }

    try {
      setIsExporting(true);
      const success = await executeSave();
      if (!success) {
        setIsExporting(false);
        return;
      }
      
      const scale = 1; // Export at 1x resolution because base is 1080px
      const baseWidth = 1080;
      const baseHeight = aspectRatio === 'story' ? 1920 : 1440;
      
      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale,
        backgroundColor: 'rgba(0,0,0,0)',
        useCORS: true,
        allowTaint: true
      };
      
      if (postElements.length === 1) {
        const dataUrl = await htmlToImage.toPng(postElements[0] as HTMLElement, options);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `post-imovel-1.png`;
        link.click();
      } else {
        const zip = new JSZip();
        
        for (let i = 0; i < postElements.length; i++) {
          const el = postElements[i] as HTMLElement;
          const dataUrl = await htmlToImage.toPng(el, options);
          const base64Data = dataUrl.replace(/^data:image\\/png;base64,/, '');
          zip.file(`post-imovel-${i + 1}.png`, base64Data, { base64: true });
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `posts-imoveis.zip`);
      }
      
      // If we were creating a new one, we could set idEmEdicao to the new ID, 
      // but it's fine to leave it to clear on next '+ Criação'.
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('Erro ao gerar a imagem. Verifique se há imagens e tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };"""

new_download_func = """const handleDownload = async () => {
    if (!hiddenRenderersRef.current) return;
    
    const postElements = hiddenRenderersRef.current.querySelectorAll('.post-template-export');
    if (!postElements || postElements.length === 0) {
      alert('Nenhuma imagem para exportar.');
      return;
    }

    try {
      setIsExporting(true);
      setExportProgressText('Salvando...');
      const success = await executeSave();
      if (!success) {
        setIsExporting(false);
        setExportProgressText(null);
        return;
      }
      
      const scale = 1; // Export at 1x resolution because base is 1080px
      const baseWidth = 1080;
      const baseHeight = aspectRatio === 'story' ? 1920 : 1440;
      
      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale,
        backgroundColor: 'rgba(0,0,0,0)',
        useCORS: true,
        allowTaint: true
      };
      
      for (let i = 0; i < postElements.length; i++) {
        setExportProgressText(`Baixando (${i + 1}/${postElements.length})...`);
        const el = postElements[i] as HTMLElement;
        const dataUrl = await htmlToImage.toPng(el, options);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `post-imovel-${i + 1}.png`;
        link.click();
        
        // Intervalo de segurança (Bypass de Bloqueio de Navegador para downloads múltiplos)
        if (i < postElements.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 600));
        }
      }
      
      // If we were creating a new one, we could set idEmEdicao to the new ID, 
      // but it's fine to leave it to clear on next '+ Criação'.
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('Erro ao gerar a imagem. Verifique se há imagens e tente novamente.');
    } finally {
      setIsExporting(false);
      setExportProgressText(null);
    }
  };"""

content = content.replace(old_download_func, new_download_func)

# 4. Update the text of the button
content = content.replace("{isExporting ? 'Gerando...' : (images.length > 1 ? `Baixar Zip (${images.length})` : 'Baixar imagem')}", "{isExporting ? (exportProgressText || 'Gerando...') : (images.length > 1 ? `Baixar Todas (${images.length})` : 'Baixar Imagem')}")

with open('src/App.tsx', 'w') as f:
    f.write(content)

