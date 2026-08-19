const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add PaywallModal import
code = code.replace(
  "import { MyAccount } from './components/MyAccount';",
  "import { MyAccount } from './components/MyAccount';\nimport { PaywallModal } from './components/PaywallModal';"
);

// 2. Add isPaywallOpen state
const stateMatch = "const [applyBrandKit, setApplyBrandKit] = useState(true);\n  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');";
const stateReplace = "const [applyBrandKit, setApplyBrandKit] = useState(true);\n  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');\n  const [isPaywallOpen, setIsPaywallOpen] = useState(false);";
code = code.replace(stateMatch, stateReplace);

// 3. Render PaywallModal in App return
const renderMatch = "return (\n    <div className=\"min-h-screen";
const renderReplace = "return (\n    <div className=\"min-h-screen\">\n      <PaywallModal \n        isOpen={isPaywallOpen} \n        onClose={() => setIsPaywallOpen(false)}\n        onUpgrade={() => {\n          setIsPaywallOpen(false);\n          setActiveTab('minha_conta');\n        }}\n      />\n      <div className=\"min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-950 transition-colors duration-200\"";
code = code.replace("return (\n    <div className=\"min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-950 transition-colors duration-200\">", renderReplace);


// 4. Update the Select element logic
const selectMatch = `<select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Família/Conforto">Família/Conforto</option>
                      <option value="Investidor/ROI">Investidor/ROI</option>
                    </select>`;

const selectReplace = `<select
                      value={targetAudience}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (userPlan === 'free' && val.includes('(Pro)')) {
                          setIsPaywallOpen(true);
                          return;
                        }
                        setTargetAudience(val);
                      }}
                      className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Família/Conforto">Família/Conforto</option>
                      <option value="Jovem/Dinâmico">Jovem/Dinâmico</option>
                      <option value="Luxo/Exclusividade (Pro)">Luxo/Exclusividade (Pro)</option>
                      <option value="Investidor/ROI (Pro)">Investidor/ROI (Pro)</option>
                    </select>`;

code = code.replace(selectMatch, selectReplace);

fs.writeFileSync('src/App.tsx', code);
