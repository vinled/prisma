const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix main container wrapper
content = content.replace(
  '<div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 overflow-hidden text-gray-900 dark:text-gray-100">',
  '<div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 overflow-x-hidden text-gray-900 dark:text-gray-100">'
);

// 2. Fix sidebar classes
content = content.replace(
  '<aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0">',
  '<aside className="w-full h-auto md:w-64 md:h-screen bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0 z-20">'
);

// 3. Fix sidebar padding & layout for mobile
content = content.replace(
  /<div className="p-6">\s*<PrismaLogo \/>\s*<\/div>/,
  `<div className="p-4 md:p-6 flex justify-between items-center">
          <PrismaLogo />
          <div className="md:hidden">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>`
);

// 4. Fix nav items layout for mobile
content = content.replace(
  /<nav className="flex-1 px-4 space-y-2 mt-4">/,
  '<nav className="px-4 pb-4 md:py-4 md:flex-1 space-y-2 md:space-y-2 md:mt-4 flex flex-col md:flex-col">'
);

// 5. Hide the desktop theme toggle on mobile
content = content.replace(
  /<div className="p-4 border-t border-gray-200 dark:border-zinc-800">/,
  '<div className="hidden md:block p-4 border-t border-gray-200 dark:border-zinc-800">'
);

// 6. Ensure main content area and grid don't overflow
// We'll add overflow-x-hidden to main and w-full
content = content.replace(
  /<main className="flex-1 overflow-y-auto">/,
  '<main className="flex-1 overflow-y-auto overflow-x-hidden w-full">'
);

content = content.replace(
  /<div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">/,
  '<div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-full">'
);

// Write changes
fs.writeFileSync('src/App.tsx', content);
console.log('App layout fixes applied.');
