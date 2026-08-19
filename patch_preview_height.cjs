const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add max-h-[50vh] md:max-h-none to the previewContainerRef div
const oldContainer = `<div ref={previewContainerRef} className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200">`;
const newContainer = `<div ref={previewContainerRef} className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200 max-h-[50vh] md:max-h-none overflow-hidden">`;
code = code.replace(oldContainer, newContainer);

// 2. Fix the wrapper so it doesn't stretch vertically with w-full aspect-[9/16] causing overflow.
// I will replace `w-full relative aspect-[9/16]` with an exact dimension wrapper.
const oldWrapper = `<div className={\`w-full relative \${aspectRatio === 'story' ? 'aspect-[9/16]' : 'aspect-square'}\`}>`;
const newWrapper = `<div className="relative mx-auto" style={{ width: 1080 * previewScale, height: (aspectRatio === 'story' ? 1920 : 1080) * previewScale }}>`;
code = code.replace(oldWrapper, newWrapper);

fs.writeFileSync('src/App.tsx', code);
