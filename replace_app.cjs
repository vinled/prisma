const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// add import
code = code.replace(
  "import { MyProperties } from './components/MyProperties';",
  "import { MyProperties } from './components/MyProperties';\nimport { GoogleGenerativeAI } from '@google/generative-ai';"
);

// replace handleGenerateCopy function body
const oldFunc = \`  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true);
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: details.propertyType || 'Imóvel',
          neighborhood: details.neighborhood || 'Não informado',
          bedrooms: details.bedrooms || 'Não informado',
          parking: details.parking || 'Não informado',
          price: details.price || 'Não informado',
          differentials: [...(details.differentials || []), ...(details.amenities || [])],
          targetAudience,
          whatsapp: details.whatsapp || brandKit?.whatsapp || ''
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar legenda');
      }

      setGeneratedCaption(data.caption);
    } catch (err: any) {
      alert(\\\`Falha ao gerar legenda: \${err.message}\\\`);
    } finally {
      setIsGeneratingCopy(false);
    }
  };\`;

const newFunc = \`  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const diffsStr = [...(details.differentials || []), ...(details.amenities || [])].join(", ");
      const promptText = \\\`Você é um copywriter especialista em mercado imobiliário de alto padrão. Crie uma legenda persuasiva para o Instagram sobre este imóvel. Tipo: \${details.propertyType || 'Imóvel'}, Bairro: \${details.neighborhood || 'Não informado'}, Quartos: \${details.bedrooms || 'Não informado'}, Vagas: \${details.parking || 'Não informado'}, Preço: \${details.price || 'Não informado'}. Diferenciais: [\${diffsStr}]. Adapte o tom de voz estritamente para o público: \${targetAudience}. Use emojis estrategicamente, bullet points limpos e finalize com uma CTA para este WhatsApp: \${details.whatsapp || brandKit?.whatsapp || ''}. Não invente dados.\\\`;

      const result = await model.generateContent(promptText);
      const textoFinal = result.response.text();
      
      setGeneratedCaption(textoFinal);
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar com a IA. Verifique as chaves.');
    } finally {
      setIsGeneratingCopy(false);
    }
  };\`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('src/App.tsx', code);
