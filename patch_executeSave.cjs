const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Bloqueio da IA
const oldHandleGenerateCopy = `const handleGenerateCopy = async () => {
    if (userPlan === 'free' && targetAudience.includes('(Pro)')) {
      setIsPaywallOpen(true);
      return;
    }`;

const newHandleGenerateCopy = `const handleGenerateCopy = async () => {
    if (userPlan !== 'pro') {
      alert('Recurso exclusivo do Plano Pro. Faça o upgrade para usar a IA!');
      setIsPaywallOpen(true);
      return;
    }
    if (userPlan === 'free' && targetAudience.includes('(Pro)')) {
      setIsPaywallOpen(true);
      return;
    }`;

code = code.replace(oldHandleGenerateCopy, newHandleGenerateCopy);

// 2. Bloqueio de Criação (executeSave)
const oldExecuteSave = `const executeSave = async (): Promise<void> => {
    return new Promise((resolve) => {`;

const newExecuteSave = `const executeSave = async (): Promise<boolean> => {
    if (userPlan !== 'pro' && !idEmEdicao && savedProperties.length >= 3) {
      alert('Limite do plano Grátis atingido (3 imóveis). Assine o Prisma Pro!');
      setIsPaywallOpen(true);
      return false;
    }

    return new Promise((resolve) => {`;

code = code.replace(oldExecuteSave, newExecuteSave);

// 3. Update resolve calls in executeSave
code = code.replace('resolve();\n      };', 'resolve(true);\n      };');

// 4. Update callers of executeSave
code = code.replace(
  `const handleSaveOnly = async () => {
    await executeSave();
    alert('Alterações salvas com sucesso!');
  };`,
  `const handleSaveOnly = async () => {
    const success = await executeSave();
    if (success) {
      alert('Alterações salvas com sucesso!');
    }
  };`
);

code = code.replace(
  /await executeSave\(\);\s+const scale = 1;/g,
  `const success = await executeSave();
      if (!success) {
        setIsExporting(false);
        return;
      }
      
      const scale = 1;`
);

fs.writeFileSync('src/App.tsx', code);
