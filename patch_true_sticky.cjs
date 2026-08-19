const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Root container (h-[100dvh] overflow-hidden)
const oldRoot = 'className="w-full max-w-[100vw] box-border flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100"';
const newRoot = 'className="w-full max-w-[100vw] box-border flex flex-col md:flex-row h-[100dvh] md:h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100"';
code = code.replace(oldRoot, newRoot);

// 2. Increase scale maxMobileHeight to 40%
code = code.replace(
  'const maxMobileHeight = window.innerHeight * 0.35;',
  'const maxMobileHeight = window.innerHeight * 0.40;'
);

// 3. Sticky wrapper classes
const oldSticky = 'className="order-1 lg:order-2 sticky top-0 z-40 bg-white dark:bg-[#0f111a] pb-4 shadow-sm md:static md:shadow-none md:pb-0 lg:sticky lg:top-6 lg:border-none lg:bg-transparent lg:z-auto lg:self-start w-full max-w-full space-y-6 min-w-0 pt-4 md:pt-0"';
const newSticky = 'className="order-1 lg:order-2 sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:sticky lg:top-6 lg:border-none lg:bg-transparent lg:z-auto lg:self-start w-full max-w-full space-y-6 min-w-0"';
code = code.replace(oldSticky, newSticky);

fs.writeFileSync('src/App.tsx', code);
