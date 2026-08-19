const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add lucide-react imports: Menu, X
code = code.replace(
  "import { Download, Layout, Moon, Sun, Copy, Check, LogOut, User } from 'lucide-react';",
  "import { Download, Layout, Moon, Sun, Copy, Check, LogOut, User, Menu, X, PlusSquare, Palette } from 'lucide-react';"
);

// 2. Add isMobileMenuOpen state
code = code.replace(
  "const [isPaywallOpen, setIsPaywallOpen] = useState(false);",
  "const [isPaywallOpen, setIsPaywallOpen] = useState(false);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);"
);

// 3. The main layout starts with:
// <div className="w-full max-w-[100vw] box-border flex flex-col md:flex-row h-[100dvh] md:h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100">
// We should add the mobile topbar before the aside, inside this div.
const oldLayout = `<div className="w-full max-w-[100vw] box-border flex flex-col md:flex-row h-[100dvh] md:h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100">`;

const newLayout = `<div className="w-full max-w-[100vw] box-border flex flex-col md:flex-row h-[100dvh] md:h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100">

      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0f111a] z-30 shrink-0">
        <PrismaLogo />
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Overlay & Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="md:hidden fixed inset-y-0 right-0 w-64 bg-white dark:bg-[#0f111a] shadow-xl z-[100] transform transition-transform flex flex-col overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-zinc-800">
              <span className="font-bold text-gray-900 dark:text-white">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col flex-1 px-4 py-6 space-y-4">
              <button
                onClick={() => { setActiveTab('meus_imoveis'); setIsMobileMenuOpen(false); }}
                className={\`flex items-center text-sm p-3 rounded-xl transition-colors \${
                  activeTab === 'meus_imoveis' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }\`}
              >
                <Layout className="w-5 h-5 mr-3" />
                Meus Imóveis
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('criacao');
                  setIdEmEdicao(null);
                  setDetails({
                    title: '', price: '', neighborhood: '', city: '', state: '',
                    area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                    propertyCode: '', propertyType: '', propertySubtype: '',
                    description: '', features: [], amenities: [], differentials: [], whatsapp: ''
                  });
                  setImages([]);
                  setPreviewScale(1);
                  setIsMobileMenuOpen(false);
                }}
                className={\`flex items-center text-sm p-3 rounded-xl transition-colors \${
                  activeTab === 'criacao' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }\`}
              >
                <PlusSquare className="w-5 h-5 mr-3" />
                Criação Rápida
              </button>

              <button
                onClick={() => { setActiveTab('minha_marca'); setIsMobileMenuOpen(false); }}
                className={\`flex items-center text-sm p-3 rounded-xl transition-colors \${
                  activeTab === 'minha_marca' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }\`}
              >
                <Palette className="w-5 h-5 mr-3" />
                Minha Marca
              </button>

              <button
                onClick={() => { setActiveTab('minha_conta'); setIsMobileMenuOpen(false); }}
                className={\`flex items-center text-sm p-3 rounded-xl transition-colors \${
                  activeTab === 'minha_conta' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }\`}
              >
                <User className="w-5 h-5 mr-3" />
                Minha Conta
              </button>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
                Alternar Tema
              </button>
              
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </button>
            </div>
          </div>
        </>
      )}`;

code = code.replace(oldLayout, newLayout);

// 4. Update Desktop Sidebar (hide on mobile)
const oldAside = `<aside className="w-full h-auto md:w-64 md:h-screen bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0 z-20">`;
const newAside = `<aside className="hidden md:flex w-full h-auto md:w-64 md:h-screen bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col transition-colors duration-200 shrink-0 z-20">`;
code = code.replace(oldAside, newAside);


fs.writeFileSync('src/App.tsx', code);
