const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the preview area
const previewRegex = /<div \s*ref=\{previewRef\}\s*className="relative shadow-xl transition-all duration-300 bg-white"\s*style=\{\{ \s*width: '540px', \s*height: aspectRatio === 'story' \? '960px' : '540px',\s*transform: `scale\(\$\{previewScale\}\)`,\s*transformOrigin: 'center',\s*fontSize: '16px' \/\/ force base size\s*\}\}\s*>/;

const newPreview = `<div
                    style={{
                      width: \`\${540 * previewScale}px\`,
                      height: \`\${(aspectRatio === 'story' ? 960 : 540) * previewScale}px\`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'visible'
                    }}
                  >
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
                  >`;

// And we need to add a closing div!
content = content.replace(previewRegex, newPreview);

// Add the closing div after </TemplateRenderer>
content = content.replace(
  /<\/TemplateRenderer>\s*<\/div>/,
  `</TemplateRenderer>\s*</div>\s*</div>`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Preview layout fixed.');
