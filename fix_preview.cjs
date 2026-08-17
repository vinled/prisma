const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldPreviewArea = `<div 
                ref={previewContainerRef}
                className="w-full flex-grow flex items-center justify-center bg-gray-100 dark:bg-zinc-950 rounded-xl overflow-hidden relative p-4 transition-colors duration-200 min-h-[400px]"
              >
                {images.length > 0 ? (
                  <div
                    style={{
                      width: \`\${540 * previewScale}px\`,
                      height: \`\${(aspectRatio === 'story' ? 960 : 540) * previewScale}px\`,
                      overflow: 'hidden'
                    }}
                  >
                  <div 
                    ref={previewRef}
                    className="relative shadow-xl transition-all duration-300 bg-white"
                    style={{ 
                      width: '540px', 
                      height: aspectRatio === 'story' ? '960px' : '540px',
                      transform: \`scale(\${previewScale})\`,
                      transformOrigin: 'top left',
                      fontSize: '16px' // force base size
                    }}
                  >`;

const newPreviewArea = `<div 
                className="flex items-center justify-center w-full overflow-hidden bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200"
              >
                {images.length > 0 ? (
                  <div
                    ref={previewContainerRef}
                    className={\`w-full h-auto \${aspectRatio === 'story' ? 'aspect-[9/16]' : 'aspect-square'} relative overflow-hidden flex items-center justify-center\`}
                  >
                  <div 
                    ref={previewRef}
                    className="absolute top-0 left-0 shadow-xl transition-all duration-300 bg-white"
                    style={{ 
                      width: '540px', 
                      height: aspectRatio === 'story' ? '960px' : '540px',
                      transform: \`scale(\${previewScale})\`,
                      transformOrigin: 'top left',
                      fontSize: '16px' // force base size
                    }}
                  >`;

// Actually let's use regex to replace it because formatting might differ slightly
