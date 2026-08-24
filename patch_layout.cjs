const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLayout = `<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legenda para Redes Sociais</h3>
                  <div className="flex flex-col gap-3 w-full mb-3">
                    <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                      <button
                        onClick={() => setDestinoCopy('instagram')}
                        className={\`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors \${destinoCopy === 'instagram' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'}\`}
                      >
                        Post para Feed/Instagram
                      </button>
                      <button
                        onClick={() => setDestinoCopy('whatsapp')}
                        className={\`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors \${destinoCopy === 'whatsapp' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'}\`}
                      >
                        Mensagem para WhatsApp
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 w-full">`;

const newLayout = `<div className="flex flex-col mb-4 gap-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Gerador de Textos com IA</h3>
                  
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                      <button
                        onClick={() => setDestinoCopy('instagram')}
                        className={\`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors \${destinoCopy === 'instagram' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'}\`}
                      >
                        Post para Feed/Instagram
                      </button>
                      <button
                        onClick={() => setDestinoCopy('whatsapp')}
                        className={\`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors \${destinoCopy === 'whatsapp' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'}\`}
                      >
                        Mensagem para WhatsApp
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3 w-full justify-end">`;

code = code.replace(oldLayout, newLayout);
fs.writeFileSync('src/App.tsx', code);
