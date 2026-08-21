const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert the state
code = code.replace(
  'const [templateOptions, setTemplateOptions] = useState<TemplateOptions>({',
  'const [seloAtivo, setSeloAtivo] = useState("");\n  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>({'
);

// Insert the badge UI
const seloUI = `
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200 mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Selo (Opcional)</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Nenhum', 'VENDIDO', 'EXCLUSIVIDADE', 'BAIXOU O VALOR', 'OPORTUNIDADE'].map(selo => {
                  const isNenhum = selo === 'Nenhum';
                  const isActive = isNenhum ? seloAtivo === '' : seloAtivo === selo;
                  return (
                    <button
                      key={selo}
                      onClick={() => setSeloAtivo(isNenhum ? '' : selo)}
                      className={\`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border \${
                        isActive 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700'
                      }\`}
                    >
                      {selo}
                    </button>
                  );
                })}
              </div>
            </section>
`;

code = code.replace(
  '            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\n              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">1. Imagens</h2>',
  '            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">\n              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">1. Imagens</h2>'
);

// Actually, I can put it right below Image Uploader section.
code = code.replace(
  '              />\n            </section>',
  '              />\n            </section>\n' + seloUI
);

// Inject into options parameter of TemplateRenderer
// First occurrence (preview)
code = code.replace(
  '                      options={templateOptions}',
  '                      options={{...templateOptions, badge: seloAtivo}}'
);
// Second occurrence (export)
code = code.replace(
  '              options={templateOptions}',
  '              options={{...templateOptions, badge: seloAtivo}}'
);


fs.writeFileSync('src/App.tsx', code);
