const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Nav container
content = content.replace(
  /<nav className="[^"]+">/,
  '<nav className="w-full grid grid-cols-2 gap-2 px-2 box-border md:flex md:flex-col md:flex-1 md:space-y-2 md:px-4 md:py-4 md:mt-4">'
);

// 2. Buttons
content = content.replace(
  /className=\{`w-full md:w-full flex shrink-0 items-center px-4 py-2 md:py-3 rounded-xl transition-colors \$\{/g,
  'className={`w-full flex justify-center md:justify-start items-center text-center md:text-left text-sm p-2 md:px-4 md:py-3 overflow-hidden truncate rounded-xl transition-colors ${'
);

// 3. Preview header
content = content.replace(
  /<div className="flex justify-between items-center mb-6">\s*<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pré-visualização do Post<\/h2>/,
  '<div className="flex flex-col w-full gap-3 items-start md:flex-row md:items-center md:justify-between mb-6">\n                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full">Pré-visualização do Post</h2>'
);

// 4. Main container
content = content.replace(
  /<div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 overflow-x-hidden text-gray-900 dark:text-gray-100">/,
  '<div className="w-full max-w-[100vw] overflow-x-hidden box-border flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100">'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Final layout fixes applied');
