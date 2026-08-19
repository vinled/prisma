const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldSidebar = `        <nav className="w-full grid grid-cols-2 gap-2 px-2 box-border md:flex md:flex-col md:flex-1 md:space-y-2 md:px-4 md:py-4 md:mt-4">
          <button
            onClick={() => setActiveTab('meus_imoveis')}`;

const newSidebar = `        <nav className="w-full grid grid-cols-3 gap-2 px-2 box-border md:flex md:flex-col md:flex-1 md:space-y-2 md:px-4 md:py-4 md:mt-4">
          <button
            onClick={() => setActiveTab('meus_imoveis')}`;
            
code = code.replace(oldSidebar, newSidebar);


const oldButton = `          </button>
        </nav>
        <div className="hidden md:flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-zinc-800">`;

const newButton = `          </button>
          
          <button
            onClick={() => setActiveTab('minha_conta')}
            className={\`w-full flex justify-center md:justify-start items-center text-center md:text-left text-sm p-2 md:px-4 md:py-3 overflow-hidden truncate rounded-xl transition-colors \${
              activeTab === 'minha_conta' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }\`}
          >
            <User className="w-5 h-5 md:mr-3" />
            <span className="hidden md:inline">Minha Conta</span>
          </button>
        </nav>
        <div className="hidden md:flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-zinc-800">`;

code = code.replace(oldButton, newButton);


const oldMainContent = `      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        {activeTab === 'minha_marca' ? (`

const newMainContent = `      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        {activeTab === 'minha_conta' && session ? (
          <MyAccount session={session} />
        ) : activeTab === 'minha_marca' ? (`

code = code.replace(oldMainContent, newMainContent);

fs.writeFileSync('src/App.tsx', code);
