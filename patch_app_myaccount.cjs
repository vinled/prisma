const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<MyAccount session={session} brandKit={brandKit} />',
  '<MyAccount session={session} brandKit={brandKit} userPlan={userPlan} />'
);

// We need to inject the "Voltar" button before "Salvar" button.
// Here is the Salvar button block:
const salvarButton = `{idEmEdicao && (
                    <button
                      onClick={handleSaveOnly}
                      disabled={isExporting}
                      className="px-4 py-2 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Salvar
                    </button>
                  )}`;

const newSalvarButton = `<button
                    onClick={() => {
                      setActiveTab('meus_imoveis');
                      setIdEmEdicao(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  ${salvarButton}`;

code = code.replace(salvarButton, newSalvarButton);

fs.writeFileSync('src/App.tsx', code);
