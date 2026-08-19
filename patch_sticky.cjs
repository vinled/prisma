const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldPreviewWrapper = `<div className="order-1 lg:order-2 sticky top-0 z-50 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 pb-4 lg:sticky lg:top-6 lg:border-none lg:pb-0 lg:bg-transparent lg:z-auto lg:self-start w-full max-w-full space-y-6 min-w-0">`;
const newPreviewWrapper = `<div className="order-1 lg:order-2 sticky top-0 z-50 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 pb-4 -mx-4 px-4 -mt-4 pt-4 lg:m-0 lg:p-0 lg:sticky lg:top-6 lg:border-none lg:bg-transparent lg:z-auto lg:self-start w-full max-w-full space-y-6 min-w-0">`;

code = code.replace(oldPreviewWrapper, newPreviewWrapper);

fs.writeFileSync('src/App.tsx', code);
