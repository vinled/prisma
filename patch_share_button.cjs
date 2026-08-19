const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldButton = `<button
                    onClick={handleDownload}
                    disabled={isExporting || images.length === 0}
                    className="absolute bottom-4 right-4 z-10 p-3 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium md:static md:p-2 md:px-4 md:rounded-lg md:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Download className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden md:inline">
                      {isExporting ? 'Gerando...' : (images.length > 1 ? \`Baixar Zip (\${images.length})\` : 'Baixar imagem')}
                    </span>
                  </button>`;
                  
// If there are multiple images, what to do? navigator.share supports multiple files, but let's just keep it simple.
// I'll call handleShare ONLY if isMobile. If not isMobile, call handleDownload.
// Or I can just check inside the onClick.
const newButton = `<button
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        handleShare();
                      } else {
                        handleDownload();
                      }
                    }}
                    disabled={isExporting || images.length === 0}
                    className="absolute bottom-4 right-4 z-10 p-3 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium md:static md:p-2 md:px-4 md:rounded-lg md:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Share2 className="w-5 h-5 md:hidden" />
                    <Download className="hidden md:block w-4 h-4 mr-2" />
                    <span className="hidden md:inline">
                      {isExporting ? 'Gerando...' : (images.length > 1 ? \`Baixar Zip (\${images.length})\` : 'Baixar imagem')}
                    </span>
                  </button>`;
code = code.replace(oldButton, newButton);

fs.writeFileSync('src/App.tsx', code);
