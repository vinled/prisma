const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace previewContainer div
content = content.replace(
  /<div \s*ref=\{previewContainerRef\}\s*className="w-full flex-grow flex items-center justify-center bg-gray-100 dark:bg-zinc-950 rounded-xl overflow-hidden relative p-4 transition-colors duration-200 min-h-\[400px\]"\s*>/,
  '<div className="flex items-center justify-center w-full overflow-hidden bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200">'
);

// Replace the inner wrapper
content = content.replace(
  /<div\s*style=\{\{\s*width: `\$\{540 \* previewScale\}px`,\s*height: `\$\{\(aspectRatio === 'story' \? 960 : 540\) \* previewScale\}px`,\s*overflow: 'hidden'\s*\}\}\s*>/,
  '<div ref={previewContainerRef} className={`w-full h-auto ${aspectRatio === \'story\' ? \'aspect-[9/16]\' : \'aspect-square\'} relative overflow-hidden flex items-center justify-center`}>'
);

// Replace the relative shadow-xl to absolute top-0 left-0
content = content.replace(
  /className="relative shadow-xl transition-all duration-300 bg-white"/,
  'className="absolute top-0 left-0 shadow-xl transition-all duration-300 bg-white"'
);

// Also fix buttons header as requested: 
// "Ajuste dos Botões Superiores: No cabeçalho da pré-visualização, garanta que o título 'Pré-visualização do Post' e os botões 'Salvar' / 'Baixar imagem' usem flex-wrap e gap-2 para que não fiquem espremidos em telas menores."
content = content.replace(
  /<div className="flex flex-col w-full gap-3 items-start md:flex-row md:items-center md:justify-between mb-6">/,
  '<div className="flex flex-wrap w-full gap-2 items-start md:items-center justify-between mb-6">'
);

content = content.replace(
  /<div className="flex items-center space-x-3">/,
  '<div className="flex flex-wrap items-center gap-2 space-x-0">'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed preview and buttons');
