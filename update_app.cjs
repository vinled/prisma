const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update state type for activeTab
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'criacao' | 'meus_imoveis'>('criacao');",
  "const [activeTab, setActiveTab] = useState<'criacao' | 'meus_imoveis' | 'minha_marca'>('criacao');"
);

// 2. Load and Save BrandKit to localStorage
code = code.replace(
  "const [brandKit, setBrandKit] = useState<BrandKit>();",
  `const [brandKit, setBrandKit] = useState<BrandKit>(() => {
    const saved = localStorage.getItem('globalBrandKit');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  });
  
  useEffect(() => {
    if (brandKit) {
      localStorage.setItem('globalBrandKit', JSON.stringify(brandKit));
    } else {
      localStorage.removeItem('globalBrandKit');
    }
  }, [brandKit]);
  
  const [applyBrandKit, setApplyBrandKit] = useState(true);`
);

// 3. Update the sidebar to include Minha Marca
const sidebarCreateTab = `            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criação Rápida
          </button>`;

const newSidebarTab = `            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criação Rápida
          </button>
          <button
            onClick={() => setActiveTab('minha_marca')}
            className={\`w-full flex justify-center md:justify-start items-center text-center md:text-left text-sm p-2 md:px-4 md:py-3 overflow-hidden truncate rounded-xl transition-colors \${
              activeTab === 'minha_marca' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }\`}
          >
            <svg className="w-5 h-5 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:inline">Minha Marca</span>
          </button>`;

code = code.replace(sidebarCreateTab, newSidebarTab);

// 4. Update the main content to handle 'minha_marca' and the toggle for brandKit
const mainContentCheck = `{activeTab === 'meus_imoveis' ? (
          <MyProperties properties={savedProperties} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (`;

const newMainContentCheck = `{activeTab === 'minha_marca' ? (
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minha Marca</h1>
              <p className="text-gray-500 dark:text-zinc-400">Configure sua identidade visual para todos os posts.</p>
            </header>
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <BrandKitForm brandKit={brandKit} onChange={setBrandKit} />
            </section>
          </div>
        ) : activeTab === 'meus_imoveis' ? (
          <MyProperties properties={savedProperties} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (`;

code = code.replace(mainContentCheck, newMainContentCheck);

// 5. Replace BrandKitForm inside "Criação Rápida" with the Toggle
const oldBrandKitSection = `<section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Identidade da marca</h2>
              <BrandKitForm brandKit={brandKit} onChange={setBrandKit} />
            </section>`;

const newToggleSection = `<section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Aplicar Assinatura Visual</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Usar dados globais de 'Minha Marca'</p>
              </div>
              <button 
                onClick={() => setApplyBrandKit(!applyBrandKit)}
                className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${applyBrandKit ? 'bg-purple-600' : 'bg-gray-200 dark:bg-zinc-700'}\`}
              >
                <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${applyBrandKit ? 'translate-x-6' : 'translate-x-1'}\`} />
              </button>
            </section>`;

code = code.replace(oldBrandKitSection, newToggleSection);

// 6. Update all TemplateRenderer props to use applyBrandKit
// In the preview area
const templateRendererMatch1 = `<TemplateRenderer 
                      templateId={selectedTemplate} 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={brandKit?.logo || null}
                      aspectRatio={aspectRatio}
                      brandKit={brandKit}`;

const newTemplateRendererMatch1 = `<TemplateRenderer 
                      templateId={selectedTemplate} 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={applyBrandKit ? (brandKit?.logo || null) : null}
                      aspectRatio={aspectRatio}
                      brandKit={applyBrandKit ? brandKit : undefined}`;

code = code.replace(templateRendererMatch1, newTemplateRendererMatch1);

// In the hidden export area
const templateRendererMatch2 = `<TemplateRenderer 
              templateId={selectedTemplate} 
              details={details} 
              image={img} 
              logo={brandKit?.logo || null}
              aspectRatio={aspectRatio}
              brandKit={brandKit}`;

const newTemplateRendererMatch2 = `<TemplateRenderer 
              templateId={selectedTemplate} 
              details={details} 
              image={img} 
              logo={applyBrandKit ? (brandKit?.logo || null) : null}
              aspectRatio={aspectRatio}
              brandKit={applyBrandKit ? brandKit : undefined}`;

code = code.replace(templateRendererMatch2, newTemplateRendererMatch2);


fs.writeFileSync('src/App.tsx', code);
