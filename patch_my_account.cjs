const fs = require('fs');
let code = fs.readFileSync('src/components/MyAccount.tsx', 'utf8');

// Add userPlan to interface
code = code.replace(
  'interface MyAccountProps {\n  session: Session;\n  brandKit?: BrandKit | null;\n}',
  'interface MyAccountProps {\n  session: Session;\n  brandKit?: BrandKit | null;\n  userPlan?: "free" | "pro";\n}'
);

// Update function signature
code = code.replace(
  'export function MyAccount({ session, brandKit }: MyAccountProps) {',
  'export function MyAccount({ session, brandKit, userPlan = "free" }: MyAccountProps) {'
);

// Replace currentPlan mock
code = code.replace(
  "const currentPlan = 'Grátis';",
  "const currentPlan = userPlan === 'pro' ? 'Pro' : 'Grátis';"
);

const oldSubscribe = `<a 
            href="https://sandbox.asaas.com/c/341595085695"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block text-center py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            Assinar Plano Pro
          </a>`;

const newSubscribe = `{userPlan === 'pro' ? (
            <div className="flex flex-col items-center">
              <div className="w-full text-center py-3 px-4 bg-green-500/10 text-green-700 dark:text-green-400 font-medium rounded-xl mb-4 border border-green-200 dark:border-green-800/30">
                Assinatura Ativa
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja cancelar sua assinatura Pro?')) {
                    alert('Solicitação recebida. O cancelamento será processado em até 24h.');
                  }
                }}
                className="text-red-500 text-sm hover:underline mt-2 transition-colors"
              >
                Cancelar Assinatura
              </button>
            </div>
          ) : (
            <a 
              href="https://sandbox.asaas.com/c/341595085695"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block text-center py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Assinar Plano Pro
            </a>
          )}`;

code = code.replace(oldSubscribe, newSubscribe);

fs.writeFileSync('src/components/MyAccount.tsx', code);
