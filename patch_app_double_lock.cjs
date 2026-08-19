const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add lock to handleGenerateCopy
const handleGenerateMatch = /const handleGenerateCopy = async \(\) => \{\n\s*setIsGeneratingCopy\(true\);/;
const handleGenerateReplace = `const handleGenerateCopy = async () => {
    if (userPlan === 'free' && targetAudience.includes('(Pro)')) {
      setIsPaywallOpen(true);
      return;
    }
    setIsGeneratingCopy(true);`;

code = code.replace(handleGenerateMatch, handleGenerateReplace);

// 2. Add lock to select onChange and update options
const selectRegex = /<select\s+value={targetAudience}\s+onChange={\(e\) => setTargetAudience\(e\.target\.value\)}\s+className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"\s*>[\s\S]*?<\/select>/;

const newSelect = `<select
                      value={targetAudience}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (userPlan === 'free' && val.includes('(Pro)')) {
                          setTargetAudience('Família/Conforto');
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

code = code.replace(selectRegex, newSelect);

fs.writeFileSync('src/App.tsx', code);
