const fs = require('fs');

// Patch PaywallModal.tsx
let paywallCode = fs.readFileSync('src/components/PaywallModal.tsx', 'utf8');

const oldCTA = `<a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onUpgrade();
            }}
            className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-purple-600/25 mb-4"
          >
            Desbloquear o Prisma Pro - R$ 49,90/mês
          </a>`;

const newCTA = `<a
            href="https://www.asaas.com/c/i1j9wljny168xx47"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onClose();
            }}
            className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-purple-600/25 mb-4"
          >
            Desbloquear o Prisma Pro - R$ 49,90/mês
          </a>`;

paywallCode = paywallCode.replace(oldCTA, newCTA);
fs.writeFileSync('src/components/PaywallModal.tsx', paywallCode);


// Patch MyAccount.tsx
let accountCode = fs.readFileSync('src/components/MyAccount.tsx', 'utf8');

const oldAccountCTA = `<a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 text-white text-center transition-colors shadow-lg shadow-purple-600/20"
          >
            Assinar Plano Pro
          </a>`;

const newAccountCTA = `<a 
            href="https://www.asaas.com/c/i1j9wljny168xx47" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 text-white text-center transition-colors shadow-lg shadow-purple-600/20"
          >
            Assinar Plano Pro
          </a>`;

accountCode = accountCode.replace(oldAccountCTA, newAccountCTA);
fs.writeFileSync('src/components/MyAccount.tsx', accountCode);
