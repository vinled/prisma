const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<nav className="px-4 pb-4 md:py-4 md:flex-1 space-y-2 md:space-y-2 md:mt-4 flex flex-col md:flex-col">',
  '<nav className="px-4 pb-4 md:py-4 md:flex-1 space-y-0 md:space-y-2 flex flex-row md:flex-col overflow-x-auto gap-2 md:gap-0 mt-0 md:mt-4">'
);

// We need to fix the full width of the buttons inside the nav so they don't stretch fully in horizontal mode
content = content.replace(
  /className=\{`w-full flex items-center px-4 py-3 rounded-xl transition-colors \$\{/g,
  'className={`w-full md:w-full flex shrink-0 items-center px-4 py-2 md:py-3 rounded-xl transition-colors ${'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Nav layout fixes applied.');
