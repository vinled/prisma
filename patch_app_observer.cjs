const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace previewContainerRef position
code = code.replace(
  '<div className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200">\n                {images.length > 0 ? (\n                  <div ref={previewContainerRef} className={`w-full relative overflow-hidden ${aspectRatio === \'story\' ? \'aspect-[9/16]\' : \'aspect-square\'}`}>',
  '<div ref={previewContainerRef} className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200">\n                {images.length > 0 ? (\n                  <div className={`w-full relative overflow-hidden ${aspectRatio === \'story\' ? \'aspect-[9/16]\' : \'aspect-square\'}`}>'
);

fs.writeFileSync('src/App.tsx', code);
