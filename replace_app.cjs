const fs = require('fs');

const content = fs.readFileSync('App_backup.tsx', 'utf-8');

const newContent = content.replace(
  /export default function App\(\) {/,
  `export default function App() {
  const [activeTab, setActiveTab] = useState<'criacao' | 'meus_imoveis'>('criacao');`
).replace(
  /return \(\s*<div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">\s*<div className="max-w-\[1600px\] mx-auto p-4 sm:p-6 lg:p-8">\s*<header className="flex justify-between items-center mb-8">\s*<div className="flex items-center gap-4">\s*<PrismaLogo \/>\s*<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerador de Posts<\/h1>\s*<\/div>\s*<button\s*onClick=\{[^}]+\}\s*className="p-2[^"]+"\s*aria-label="Toggle dark mode"\s*>\s*\{isDarkMode \? <Sun className="w-5 h-5" \/> : <Moon className="w-5 h-5" \/>\}\s*<\/button>\s*<\/header>\s*<div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">/,
  `return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0">
        <div className="p-6">
          <PrismaLogo />
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('meus_imoveis')}
            className={\`w-full flex items-center px-4 py-3 rounded-xl transition-colors \${
              activeTab === 'meus_imoveis' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }\`}
          >
            <Layout className="w-5 h-5 mr-3" />
            Meus Imóveis
          </button>
          <button
            onClick={() => setActiveTab('criacao')}
            className={\`w-full flex items-center px-4 py-3 rounded-xl transition-colors \${
              activeTab === 'criacao' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }\`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criação Rápida
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'meus_imoveis' ? (
          <div className="p-12 flex flex-col items-center justify-center h-full text-gray-500 dark:text-zinc-400">
            <Layout className="w-16 h-16 mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Meus Imóveis</h2>
            <p>Ainda não há imóveis salvos. Crie o seu primeiro post na guia Criação Rápida.</p>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
            </header>
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">`
).replace(
  /        <\/div>\s*<\/div>\s*\{\/\* Hidden containers for export \*\/\}/,
  `        </div>
          </div>
        )}
      </main>
      {/* Hidden containers for export */}`
);

fs.writeFileSync('src/App.tsx', newContent);
console.log('App.tsx rewritten.');
