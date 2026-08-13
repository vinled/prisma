const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add imports
content = content.replace(
  /import \{ Download, Layout, Moon, Sun \} from 'lucide-react';/,
  "import { Download, Layout, Moon, Sun, Copy, Check } from 'lucide-react';"
);

// 2. Add state
const stateInsertionPoint = "const [templateOptions, setTemplateOptions] = useState<TemplateOptions>({});";
const stateToAdd = `

  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const type = details.propertyType || 'Imóvel';
    const title = details.title ? \`\${details.title} \` : '';
    const neighborhood = details.neighborhood || 'Localização privilegiada';
    const l1 = \`🚀 \${title}\${type} exclusivo em \${neighborhood}!\`;

    const area = details.area ? \`📐 \${details.area}m²\` : '';
    const beds = details.bedrooms ? \`🛏️ \${details.bedrooms} Quartos\` : '';
    const suites = details.suites ? \`(\${details.suites} Suítes)\` : '';
    const parking = details.parking ? \`🚘 \${details.parking} Vagas\` : '';
    
    const metrics = [area, beds + (suites ? \` \${suites}\` : ''), parking].filter(Boolean).join(' | ');
    const l3 = metrics ? \`\${metrics}\\n\\n\` : '';

    const diffs = [...(details.differentials || []), ...(details.amenities || [])];
    let l5 = '';
    if (diffs.length > 0) {
      const list = diffs.map(d => \`✅ \${d}\`).join('\\n');
      l5 = \`✨ Destaques do imóvel:\\n\${list}\\n\\n\`;
    }

    const l8 = details.price ? \`💰 Investimento: \${details.price}\\n\` : '';
    const cityState = [details.city, details.state].filter(Boolean).join('/');
    const l9 = \`📍 \${[details.neighborhood, cityState].filter(Boolean).join(', ')}\\n\\n\`;
    
    const phone = details.whatsapp || brandKit?.whatsapp || '';
    const l11 = \`📲 Entre em contato para mais detalhes e agendamento! \${phone}\`;

    const fullText = \`\${l1}\\n\\n\${l3}\${l5}\${l8}\${l9}\${l11}\`;
    
    setGeneratedCaption(fullText.trim());
  }, [details, brandKit]);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
`;
content = content.replace(stateInsertionPoint, stateInsertionPoint + stateToAdd);

// 3. Fix the container class
content = content.replace(
  /<div className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full">/,
  '<div className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full space-y-6">'
);

// 4. Add the caption module
const captionModule = `
            {/* Smart Caption Module */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Legenda para Redes Sociais</h3>
                <div className="relative">
                   <textarea 
                     readOnly 
                     rows={10} 
                     className="w-full p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-700 dark:text-zinc-300 resize-none focus:outline-none"
                     value={generatedCaption}
                   />
                   <button 
                     onClick={handleCopyCaption}
                     className="absolute bottom-3 right-3 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm flex items-center"
                   >
                     {isCopied ? (
                       <><Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Copiado!</>
                     ) : (
                       <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copiar Legenda</>
                     )}
                   </button>
                </div>
            </div>
          </div>
`;
content = content.replace(
  /<\/p>\s*<\/div>\s*<\/div>/,
  `</p>\n            </div>` + captionModule
);

fs.writeFileSync('src/App.tsx', content);
console.log('Caption logic added.');
