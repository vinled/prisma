const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update the Preview Side wrapper
const oldPreviewSideWrapper = `<div className="order-1 lg:order-2 sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:sticky lg:top-6 lg:border-none lg:bg-transparent lg:z-auto lg:self-start w-full max-w-full space-y-6 min-w-0">`;
const newPreviewSideWrapper = `<div className="contents lg:block lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full lg:space-y-6 min-w-0">`;
code = code.replace(oldPreviewSideWrapper, newPreviewSideWrapper);

// 2. Update the Preview Card wrapper (add order-1 and sticky to it for mobile)
const oldPreviewCard = `<div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200">`;
const newPreviewCard = `<div className="order-1 lg:order-none sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200">`;
code = code.replace(oldPreviewCard, newPreviewCard);

// 3. Update the Caption Card wrapper (add order-3 for mobile, and margins since contents breaks space-y on mobile)
// Wait, the Smart Caption module is currently inside the Preview Side wrapper, immediately following the closing div of the Preview Card.
const oldCaptionCard = `{/* Smart Caption Module */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">`;
const newCaptionCard = `{/* Smart Caption Module */}
            <div className="order-3 lg:order-none mt-6 lg:mt-0 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">`;
code = code.replace(oldCaptionCard, newCaptionCard);

fs.writeFileSync('src/App.tsx', code);
