const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// replace TemplateRenderer import with KonvaCard
code = code.replace(
  "import { TemplateRenderer } from './components/TemplateRenderer';",
  "import { KonvaCard } from './components/KonvaCard';"
);

// remove htmlToImage import
code = code.replace("import * as htmlToImage from 'html-to-image';\n", "");

// replace hidden renderers and DOM export with simple Konva export
// In handleDownload:
const handleDownloadReplacement = `
  const stageRef = useRef<any>(null);

  const handleDownload = async () => {
    if (!stageRef.current) return;
    
    try {
      setIsExporting(true);
      await executeSave();
      
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 1 });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = \`post-imovel.png\`;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('Erro ao gerar a imagem. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };
`;

code = code.replace(/const handleDownload = async \(\) => \{[\s\S]*?setIsExporting\(false\);\n    \}\n  \};/, handleDownloadReplacement);

// Remove the HTML hidden renderers
code = code.replace(
  /<div \n        ref=\{hiddenRenderersRef\}[\s\S]*?<\/div>\n    <\/div>\n  \);\n\}/,
  "    </div>\n  );\n}"
);

// Update preview rendering to use KonvaCard
const previewReplacement = `
              <div className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200">
                {images.length > 0 ? (
                  <div ref={previewContainerRef} className={\`w-full relative overflow-hidden flex justify-center items-center \${aspectRatio === 'story' ? 'aspect-[9/16]' : 'aspect-square'}\`}>
                    <KonvaCard 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={brandKit?.logo || null}
                      aspectRatio={aspectRatio}
                      brandKit={brandKit}
                      scale={previewScale}
                      stageRef={stageRef}
                    />
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <p>Adicione fotos para visualizar</p>
                  </div>
                )}
              </div>
`;

code = code.replace(
  /<div className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200">[\s\S]*?<\/div>\n                \)}\n              <\/div>/,
  previewReplacement
);

// We need to remove previewRef since we don't use it
code = code.replace(/const previewRef = useRef<HTMLDivElement>\(null\);\n  /, "");

// Write back
fs.writeFileSync('src/App.tsx', code);

