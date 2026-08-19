const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Hide the Sidebar/Header when scrolling down on mobile.
// For simplicity, since the root has h-[100dvh] overflow-hidden and the <main> scrolls, 
// we can hide the sidebar top bar on the "Criação Rápida" tab on mobile, 
// OR just hide it entirely when the user is on the "Criação Rápida" tab on mobile.
// Wait, the prompt says: "oculte completamente o menu/cabeçalho superior (Logo, botões de navegação, ícones de perfil) APENAS no mobile quando o usuário estiver rolando a tela, ou simplifique-o para ocupar o mínimo de altura possível (ex: hidden md:flex para os links secundários)."
// Let's go with the simpler approach: hide the navigation links on mobile completely in the "Criação Rápida" tab, or just make them hidden md:flex.
// The sidebar is an <aside>.
const oldNavBlock = `<nav className="flex-1 md:space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible">`;
const newNavBlock = `<nav className="flex-1 space-x-2 md:space-x-0 md:space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible hidden md:flex">`;
// Wait, if I hide it completely, they can't switch tabs. 
// "simplifique-o para ocupar o mínimo de altura possível (ex: hidden md:flex para os links secundários)"
// The sidebar top bar has Logo, Theme toggle, and Logout. Then the Nav bar.
// Let's make the entire `<aside>` hide on mobile IF activeTab is 'criacao'.
const oldAside = `<aside className="w-full h-auto md:w-64 md:h-screen bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0 z-20">`;
const newAside = `<aside className={\`w-full h-auto md:w-64 md:h-screen bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0 z-20 \${activeTab === 'criacao' ? 'hidden md:flex' : ''}\`}>`;
code = code.replace(oldAside, newAside);


// 2. Hide "Pré-visualização do Post" header text and action buttons wrapper on mobile.
// Let's modify the header container.
const oldPreviewHeader = `<div className="flex flex-wrap w-full gap-2 items-start md:items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full">Pré-visualização do Post</h2>
                <div className="flex flex-wrap items-center gap-2 space-x-0">`;
const newPreviewHeader = `<div className="hidden md:flex flex-wrap w-full gap-2 items-start md:items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full">Pré-visualização do Post</h2>
                <div className="flex flex-wrap items-center gap-2 space-x-0">`;
code = code.replace(oldPreviewHeader, newPreviewHeader);


// 3. Floating Download Button for Mobile
// We need to inject the floating download button *outside* of the hidden header.
// It will be inside the preview card.
const floatingButtonHTML = `
              {/* Floating Action Buttons for Mobile */}
              <div className="md:hidden absolute bottom-2 right-2 z-50 flex gap-2">
                {idEmEdicao && (
                  <button
                    onClick={handleSaveOnly}
                    disabled={isExporting}
                    className="p-3 bg-white dark:bg-zinc-800 text-emerald-600 border border-emerald-600 rounded-full shadow-lg disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  disabled={isExporting || images.length === 0}
                  className="p-3 bg-emerald-600 text-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
`;

// Insert the floating buttons right after the start of the Preview Card.
// The Preview Card has class: order-1 lg:order-none sticky top-0 ... relative
// I need to make sure the card has 'relative' position.
const oldCardWrapper = `<div className="order-1 lg:order-none sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200">`;
const newCardWrapper = `<div className="order-1 lg:order-none sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-2 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative">
${floatingButtonHTML}`;
code = code.replace(oldCardWrapper, newCardWrapper);


// 4. Hide Footer text on mobile
const oldFooterText = `<p className="text-center text-sm text-gray-400 mt-4">`;
const newFooterText = `<p className="hidden md:block text-center text-sm text-gray-400 mt-4">`;
code = code.replace(oldFooterText, newFooterText);


// 5. Restrict Canvas width on Mobile to force auto-scale down
// The container width is currently full width.
const oldCanvasWrapper = `<div className="relative w-full aspect-square md:aspect-auto md:w-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-zinc-800 rounded-lg" ref={previewContainerRef}>`;
const newCanvasWrapper = `<div className="relative w-[65%] mx-auto aspect-square md:aspect-auto md:w-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-zinc-800 rounded-lg" ref={previewContainerRef}>`;
code = code.replace(oldCanvasWrapper, newCanvasWrapper);


// 6. Update maxMobileHeight to 250px (25vh roughly, let's use innerHeight * 0.25)
code = code.replace(
  'const maxMobileHeight = window.innerHeight * 0.40;',
  'const maxMobileHeight = window.innerHeight * 0.25;'
);


// 7. Hide the "Criação Rápida" header title on mobile, since the sidebar is hidden, we might want to hide the page header too.
const oldPageHeader = `<header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
            </header>`;
const newPageHeader = `<header className="hidden md:flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
            </header>`;
code = code.replace(oldPageHeader, newPageHeader);

// 8. One final adjustment: we made the aside hidden on mobile for activeTab==='criacao'. 
// But how will the user exit this tab? We need a back button if the sidebar is hidden!
// The user prompt only asked: "oculte completamente o menu/cabeçalho superior ... ou simplifique-o para ocupar o mínimo de altura possível (ex: hidden md:flex para os links secundários)."
// So maybe hiding it completely is bad for navigation. Let's just make it VERY compact instead of completely hidden.
// Reverting the Aside change and instead hiding the nav links on mobile when on 'criacao'.
