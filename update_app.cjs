const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
content = content.replace(
  /import \{ TemplateRenderer \} from '\.\/components\/TemplateRenderer';/,
  `import { TemplateRenderer } from './components/TemplateRenderer';\nimport { MyProperties } from './components/MyProperties';`
);

// Replace the activeTab === 'meus_imoveis' content
content = content.replace(
  /<div className="p-12 flex flex-col items-center justify-center h-full text-gray-500 dark:text-zinc-400">\s*<Layout className="w-16 h-16 mb-4 opacity-50" \/>\s*<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Meus Imóveis<\/h2>\s*<p>Ainda não há imóveis salvos\. Crie o seu primeiro post na guia Criação Rápida\.<\/p>\s*<\/div>/,
  `<MyProperties />`
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated.');
