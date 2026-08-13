const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add idEmEdicao state
if (!content.includes('const [idEmEdicao, setIdEmEdicao]')) {
  content = content.replace(
    /const \[activeTab, setActiveTab\] = useState<'criacao' \| 'meus_imoveis'>\('criacao'\);/,
    `const [activeTab, setActiveTab] = useState<'criacao' | 'meus_imoveis'>('criacao');\n  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);`
  );
}

// 2. Modify "handleEdit" to set idEmEdicao
if (content.includes('const handleEdit = (prop: SavedProperty) => {')) {
  content = content.replace(
    /const handleEdit = \(prop: SavedProperty\) => \{/,
    `const handleEdit = (prop: SavedProperty) => {
    setIdEmEdicao(prop.id);`
  );
}

// 3. Update 'Criação Rápida' sidebar button to clear details and idEmEdicao
content = content.replace(
  /onClick=\{\(\) => setActiveTab\('criacao'\)\}/,
  `onClick={() => {
              setActiveTab('criacao');
              setIdEmEdicao(null);
              setDetails({
                title: '', price: '', neighborhood: '', city: '', state: '',
                area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                propertyCode: '', propertyType: '', propertySubtype: '',
                amenities: [], differentials: [], leisureArea: null, whatsapp: ''
              });
              setImages([]);
            }}`
);

// 4. Update saving logic to handle idEmEdicao inside handleDownload, and extract it so we can use it for Save Only
// Currently savePropertyData is nested inside handleDownload.
// Let's replace the whole handleDownload and handleSaveOnly logic.

// First, locate handleDownload
const handleDownloadStart = content.indexOf('const handleDownload = async () => {');
const handleEditStart = content.indexOf('const handleEdit = (prop: SavedProperty) => {');

if (handleDownloadStart !== -1 && handleEditStart !== -1) {
  const beforeDownload = content.substring(0, handleDownloadStart);
  const afterEdit = content.substring(handleEditStart);

  const replacementCode = `
  const executeSave = async (): Promise<void> => {
    return new Promise((resolve) => {
      const generateThumbnail = (imageUrl: string): Promise<string> => {
        return new Promise((res) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 64;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const minSize = Math.min(img.width, img.height);
              const sx = (img.width - minSize) / 2;
              const sy = (img.height - minSize) / 2;
              ctx.drawImage(img, sx, sy, minSize, minSize, 0, 0, size, size);
              res(canvas.toDataURL('image/jpeg', 0.6));
            } else {
              res('');
            }
          };
          img.onerror = () => res('');
          img.src = imageUrl;
        });
      };

      const finalizeSave = (thumbnailStr?: string) => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        
        let finalThumbnail = thumbnailStr;
        if (finalThumbnail === undefined && idEmEdicao) {
          finalThumbnail = savedProperties.find(p => p.id === idEmEdicao)?.thumbnail;
        }
        
        const propertyData: SavedProperty = {
          id: idEmEdicao || Date.now().toString(),
          date: dateStr,
          details,
          selectedTemplate,
          aspectRatio,
          templateOptions,
          thumbnail: finalThumbnail
        };
        
        let updated;
        if (idEmEdicao) {
          updated = savedProperties.map(p => p.id === idEmEdicao ? propertyData : p);
        } else {
          updated = [propertyData, ...savedProperties];
        }
        
        setSavedProperties(updated);
        localStorage.setItem('prisma_imoveis', JSON.stringify(updated));
        resolve();
      };

      if (images.length > 0) {
        generateThumbnail(images[0]).then(finalizeSave);
      } else {
        finalizeSave();
      }
    });
  };

  const handleSaveOnly = async () => {
    await executeSave();
    alert('Alterações salvas com sucesso!');
  };

  const handleDownload = async () => {
    if (!hiddenRenderersRef.current) return;
    
    const postElements = hiddenRenderersRef.current.querySelectorAll('.post-template-export');
    if (!postElements || postElements.length === 0) {
      alert('Nenhuma imagem para exportar.');
      return;
    }

    try {
      setIsExporting(true);
      await executeSave();
      
      const scale = 2; // Export at 2x resolution
      const baseWidth = 540;
      const baseHeight = aspectRatio === 'story' ? 960 : 540;
      
      const options = {
        width: baseWidth * scale,
        height: baseHeight * scale,
        style: { 
          transform: \`scale(\${scale})\`, 
          transformOrigin: 'top left',
          width: \`\${baseWidth}px\`,
          height: \`\${baseHeight}px\`
        }
      };
      
      if (postElements.length === 1) {
        const dataUrl = await domtoimage.toPng(postElements[0] as HTMLElement, options);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = \`post-imovel-1.png\`;
        link.click();
      } else {
        const zip = new JSZip();
        
        for (let i = 0; i < postElements.length; i++) {
          const el = postElements[i] as HTMLElement;
          const dataUrl = await domtoimage.toPng(el, options);
          const base64Data = dataUrl.replace(/^data:image\\/png;base64,/, '');
          zip.file(\`post-imovel-\${i + 1}.png\`, base64Data, { base64: true });
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, \`posts-imoveis.zip\`);
      }
      
      // If we were creating a new one, we could set idEmEdicao to the new ID, 
      // but it's fine to leave it to clear on next '+ Criação'.
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('Erro ao gerar a imagem. Verifique se há imagens e tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  `;

  content = beforeDownload + replacementCode + afterEdit;
}

// 5. Update the buttons in the UI for idEmEdicao logic
// Replace the button block:
const btnRegex = /<div className="flex justify-between items-center mb-6">\s*<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pré-visualização do Post<\/h2>\s*<button\s*onClick=\{handleDownload\}\s*disabled=\{isExporting \|\| images\.length === 0\}\s*className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"\s*>\s*<Download className="w-4 h-4 mr-2" \/>\s*\{isExporting \? 'Gerando\.\.\.' : \(images\.length > 1 \? `Baixar Zip \(\$\{images\.length\}\)` : 'Baixar imagem'\)\}\s*<\/button>\s*<\/div>/;

const newButtons = `<div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pré-visualização do Post</h2>
                <div className="flex items-center space-x-3">
                  {idEmEdicao && (
                    <button
                      onClick={handleSaveOnly}
                      disabled={isExporting}
                      className="px-4 py-2 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Salvar
                    </button>
                  )}
                  <button
                    onClick={handleDownload}
                    disabled={isExporting || images.length === 0}
                    className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? 'Gerando...' : (images.length > 1 ? \`Baixar Zip (\${images.length})\` : 'Baixar imagem')}
                  </button>
                </div>
              </div>`;

content = content.replace(btnRegex, newButtons);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx fully patched');
