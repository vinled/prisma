const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove overflow-x-hidden from main wrapper
code = code.replace(
  'className="w-full max-w-[100vw] overflow-x-hidden box-border flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100"',
  'className="w-full max-w-[100vw] box-border flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100"'
);

// 2. Remove overflow-x-hidden from main tag
code = code.replace(
  '<main className="flex-1 overflow-y-auto overflow-x-hidden w-full">',
  '<main className="flex-1 overflow-y-auto w-full">'
);

// 3. Fix the AI button flex container and button classes
const oldFlex = '<div className="flex items-center gap-2">';
const newFlex = '<div className="flex flex-col md:flex-row gap-3 w-full">';

// We only want to replace the flex container that has the select for AI button. Let's do a more precise replacement.
const oldAIBlock = `<div className="flex items-center gap-2">
                    <select
                      value={targetAudience}`;
const newAIBlock = `<div className="flex flex-col md:flex-row gap-3 w-full">
                    <select
                      value={targetAudience}`;
code = code.replace(oldAIBlock, newAIBlock);

const oldButton = `className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap shadow-sm"
                    >
                      {isGeneratingCopy ? 'Escrevendo...' : '✨ Gerar Copy com IA (Pro)'}`;
const newButton = `className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap shadow-sm"
                    >
                      {isGeneratingCopy ? 'Escrevendo...' : '✨ Gerar Copy com IA (Pro)'}`;
code = code.replace(oldButton, newButton);

const oldSelectClass = `className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"`;
// Wait, I should make the select w-full md:w-auto too. Let's find the select that has value={targetAudience}
const selectMatch = /<select\s+value={targetAudience}\s+onChange={\(e\) => {[\s\S]*?className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/;
code = code.replace(selectMatch, (match) => {
    return match.replace(
        'className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"',
        'className="w-full md:w-auto px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"'
    );
});


// 4. Update the sticky wrapper as requested:
// "sticky top-0 z-40 bg-white dark:bg-[#0f111a] pb-4 shadow-sm md:static md:shadow-none md:pb-0"
// Current wrapper:
const oldSticky = `className="order-1 lg:order-2 sticky top-0 z-50 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 pb-4 -mx-4 px-4 -mt-4 pt-4 lg:m-0 lg:p-0 lg:sticky lg:top-6 lg:border-none lg:bg-transparent lg:z-auto lg:self-start w-full max-w-full space-y-6 min-w-0"`;
const newSticky = `className="order-1 lg:order-2 sticky top-0 z-40 bg-white dark:bg-[#0f111a] pb-4 shadow-sm md:static md:shadow-none md:pb-0 lg:sticky lg:top-6 lg:border-none lg:bg-transparent lg:z-auto lg:self-start w-full max-w-full space-y-6 min-w-0 pt-4 md:pt-0"`;
code = code.replace(oldSticky, newSticky);

fs.writeFileSync('src/App.tsx', code);
