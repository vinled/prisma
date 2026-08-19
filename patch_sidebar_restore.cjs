const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Undo the hidden md:flex on the aside
const asideRegex = /<aside className=\{`w-full h-auto md:w-64 md:h-screen bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0 z-20 \${activeTab === 'criacao' \? 'hidden md:flex' : ''}`\}>/;
const normalAside = `<aside className="w-full h-auto md:w-64 md:h-screen bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0 z-20">`;
code = code.replace(asideRegex, normalAside);

// Find the nav and hide it on mobile when activeTab is criacao
const navMatch = /<nav className="flex-1 md:space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible">/;
// We'll just make the nav hide conditionally
const newNav = `<nav className={\`flex-1 md:space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible \${activeTab === 'criacao' ? 'hidden md:flex' : ''}\`}>`;
code = code.replace(navMatch, newNav);

// Also we should hide the header block of the sidebar conditionally to save maximum space
const sidebarHeaderMatch = /<div className="p-4 md:p-6 flex justify-between items-center">/;
const newSidebarHeader = `<div className={\`p-4 md:p-6 flex justify-between items-center \${activeTab === 'criacao' ? 'hidden md:flex' : ''}\`}>`;
code = code.replace(sidebarHeaderMatch, newSidebarHeader);

fs.writeFileSync('src/App.tsx', code);
