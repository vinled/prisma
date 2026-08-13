const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// We need a ref for the preview container to calculate the scale
if (!content.includes('const previewContainerRef = useRef<HTMLDivElement>(null);')) {
  content = content.replace(
    /const previewRef = useRef<HTMLDivElement>\(null\);/,
    `const previewRef = useRef<HTMLDivElement>(null);\n  const previewContainerRef = useRef<HTMLDivElement>(null);\n  const [previewScale, setPreviewScale] = useState(1);`
  );
  
  // Add useEffect to calculate scale
  content = content.replace(
    /useEffect\(\(\) => \{\s*if \(typeof window \!== 'undefined'\) \{\s*localStorage\.setItem\('prisma_isDarkMode', isDarkMode\.toString\(\)\);\s*if \(isDarkMode\) \{\s*document\.documentElement\.classList\.add\('dark'\);\s*\} else \{\s*document\.documentElement\.classList\.remove\('dark'\);\s*\}\s*\}\s*\}, \[isDarkMode\]\);/,
    `useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('prisma_isDarkMode', isDarkMode.toString());
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const container = previewContainerRef.current;
        const padding = 32; // 16px padding on each side
        const availableWidth = container.clientWidth - padding;
        const availableHeight = container.clientHeight - padding;
        
        const baseWidth = 540;
        const baseHeight = aspectRatio === 'story' ? 960 : 540;
        
        const scaleX = availableWidth / baseWidth;
        const scaleY = availableHeight / baseHeight;
        
        setPreviewScale(Math.min(scaleX, scaleY, 1));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [aspectRatio, images.length, activeTab]);`
  );
}

// Update the preview area
const previewAreaRegex = /<div className="w-full flex-grow flex items-center justify-center bg-gray-100 dark:bg-zinc-950 rounded-xl overflow-hidden relative p-4 transition-colors duration-200">\s*\{images\.length > 0 \? \(\s*<div\s*className=\{`w-full \$\{aspectRatio === 'story' \? 'max-w-\[320px\] aspect-\[9\/16\]' : 'max-w-\[500px\] aspect-square'\} flex items-center justify-center relative shadow-sm transition-all duration-300`\}\s*ref=\{previewRef\}\s*>\s*<TemplateRenderer\s*templateId=\{selectedTemplate\}\s*details=\{details\}\s*image=\{images\[previewIndex\] \|\| null\}\s*logo=\{brandKit\?\.logo \|\| null\}\s*aspectRatio=\{aspectRatio\}\s*brandKit=\{brandKit\}\s*options=\{templateOptions\}\s*\/>\s*<\/div>\s*\) : \(\s*<div className="text-gray-400 text-center">\s*<p>Adicione fotos para visualizar<\/p>\s*<\/div>\s*\)\}\s*<\/div>/;

const newPreviewArea = `<div 
                ref={previewContainerRef}
                className="w-full flex-grow flex items-center justify-center bg-gray-100 dark:bg-zinc-950 rounded-xl overflow-hidden relative p-4 transition-colors duration-200 min-h-[400px]"
              >
                {images.length > 0 ? (
                  <div 
                    ref={previewRef}
                    className="relative shadow-xl transition-all duration-300 bg-white"
                    style={{ 
                      width: '540px', 
                      height: aspectRatio === 'story' ? '960px' : '540px',
                      transform: \`scale(\${previewScale})\`,
                      transformOrigin: 'center',
                      fontSize: '16px' // force base size
                    }}
                  >
                    <TemplateRenderer 
                      templateId={selectedTemplate} 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={brandKit?.logo || null}
                      aspectRatio={aspectRatio}
                      brandKit={brandKit}
                      options={templateOptions}
                    />
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <p>Adicione fotos para visualizar</p>
                  </div>
                )}
              </div>`;

content = content.replace(previewAreaRegex, newPreviewArea);

fs.writeFileSync('src/App.tsx', content);
console.log('Preview area fixed.');
