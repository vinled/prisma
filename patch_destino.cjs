const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert the state
code = code.replace(
  "const [targetAudience, setTargetAudience] = useState('Família/Conforto');\n  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);",
  "const [targetAudience, setTargetAudience] = useState('Família/Conforto');\n  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);\n  const [destinoCopy, setDestinoCopy] = useState('instagram');"
);

// Inject logic into handleGenerateCopy
const promptLogic = `const diffsStr = [...(details.differentials || []), ...(details.amenities || [])].join(", ");
      
      let regrasDeFormato = '';
      if (destinoCopy === 'instagram') {
        regrasDeFormato = "Formate como um post de Instagram. Use parágrafos curtos, emojis espaçados para leitura fluida, inclua hashtags relevantes no final e crie uma chamada para ação (CTA) convidando para comentar ou enviar direct.";
      } else if (destinoCopy === 'whatsapp') {
        regrasDeFormato = "Formate como uma mensagem privada de WhatsApp enviada de um corretor para um cliente vip. Seja extremamente direto, persuasivo e curto. NÃO use hashtags. Use formatação nativa do WhatsApp (ex: *negrito* para o preço e destaques). Termine com uma pergunta fechada de engajamento, como 'Podemos agendar uma visita amanhã?' ou 'Faz sentido para você?'";
      }

      const promptText = \`Você é um copywriter de alto padrão no mercado imobiliário. Crie um texto para o imóvel com os dados: Tipo: \${details.propertyType || 'Imóvel'}, Bairro: \${details.neighborhood || 'Não informado'}, Quartos: \${details.bedrooms || 'Não informado'}, Vagas: \${details.parking || 'Não informado'}, Preço: \${details.price || 'Não informado'}, Diferenciais: [\${diffsStr}]. \${regrasDeFormato} O Tom do texto deve ser: \${targetAudience}. Adicione CTA para este WhatsApp: \${details.whatsapp || (applyBrandKit ? brandKit?.whatsapp : '') || ''}. Não invente dados.\`;
`;

// Looking at the original promptText creation:
const originalPromptLogic = `const diffsStr = [...(details.differentials || []), ...(details.amenities || [])].join(", ");
      const promptText = \`Você é um copywriter especialista em mercado imobiliário de alto padrão. Crie uma legenda persuasiva para o Instagram sobre este imóvel. Tipo: \${details.propertyType || 'Imóvel'}, Bairro: \${details.neighborhood || 'Não informado'}, Quartos: \${details.bedrooms || 'Não informado'}, Vagas: \${details.parking || 'Não informado'}, Preço: \${details.price || 'Não informado'}. Diferenciais: [\${diffsStr}]. Adapte o tom de voz estritamente para o público: \${targetAudience}. Use emojis estrategicamente, bullet points limpos e finalize com uma CTA para este WhatsApp: \${details.whatsapp || (applyBrandKit ? brandKit?.whatsapp : '') || ''}. Não invente dados.\`;`;

code = code.replace(originalPromptLogic, promptLogic);

// Insert UI toggle
const uiHtml = `<div className="flex flex-col gap-3 w-full mb-3">
                    <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                      <button
                        onClick={() => setDestinoCopy('instagram')}
                        className={\`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors \${destinoCopy === 'instagram' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'}\`}
                      >
                        Post para Feed/Instagram
                      </button>
                      <button
                        onClick={() => setDestinoCopy('whatsapp')}
                        className={\`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors \${destinoCopy === 'whatsapp' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'}\`}
                      >
                        Mensagem para WhatsApp
                      </button>
                    </div>
                  </div>`;

// Insert the toggle before the div with select and button
code = code.replace(
  '<div className="flex flex-col md:flex-row gap-3 w-full">',
  uiHtml + '\n                  <div className="flex flex-col md:flex-row gap-3 w-full">'
);

fs.writeFileSync('src/App.tsx', code);
