const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add 'relative' to the card wrapper
const oldCardWrapper = '<div className="order-1 lg:order-none sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200">';
const newCardWrapper = '<div className="order-1 lg:order-none sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative">';
code = code.replace(oldCardWrapper, newCardWrapper);

// 2. Hide Title on mobile
const oldTitle = '<h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full">Pré-visualização do Post</h2>';
const newTitle = '<h2 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full">Pré-visualização do Post</h2>';
code = code.replace(oldTitle, newTitle);

// 3. Update the Download Button
const oldButton = `<button
                    onClick={handleDownload}
                    disabled={isExporting || images.length === 0}
                    className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? 'Gerando...' : (images.length > 1 ? \`Baixar Zip (\${images.length})\` : 'Baixar imagem')}
                  </button>`;
                  
const newButton = `<button
                    onClick={handleDownload}
                    disabled={isExporting || images.length === 0}
                    className="absolute bottom-4 right-4 z-10 p-3 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium md:static md:p-2 md:px-4 md:rounded-lg md:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Download className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden md:inline">
                      {isExporting ? 'Gerando...' : (images.length > 1 ? \`Baixar Zip (\${images.length})\` : 'Baixar imagem')}
                    </span>
                  </button>`;
code = code.replace(oldButton, newButton);

fs.writeFileSync('src/App.tsx', code);
