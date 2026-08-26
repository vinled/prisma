import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "const handleGenerateCopy = async () => {"
end_marker = "const handleCopyCaption = () => {"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    before = content[:start_idx]
    after = content[end_idx:]
    
    new_logic = """const handleGenerateCopy = async () => {
    if (userPlan !== 'pro') {
      alert('Recurso exclusivo do Plano Pro. Faça o upgrade para usar a IA!');
      setIsPaywallOpen(true);
      return;
    }
    if (userPlan === 'free' && targetAudience.includes('(Pro)')) {
      setIsPaywallOpen(true);
      return;
    }
    setIsGeneratingCopy(true);
    try {
      const diffsStr = [...(details.differentials || []), ...(details.amenities || [])].join(", ");
      
      let regrasDeFormato = '';
      if (destinoCopy === 'instagram') {
        regrasDeFormato = "Formate como um post de Instagram. Use parágrafos curtos, emojis espaçados para leitura fluida, inclua hashtags relevantes no final e crie uma chamada para ação (CTA) convidando para comentar ou enviar direct.";
      } else if (destinoCopy === 'whatsapp') {
        regrasDeFormato = "Formate como uma mensagem privada de WhatsApp enviada de um corretor para um cliente vip. Seja extremamente direto, persuasivo e curto. NÃO use hashtags. Use formatação nativa do WhatsApp (ex: *negrito* para o preço e destaques). Termine com uma pergunta fechada de engajamento, como 'Podemos agendar uma visita amanhã?' ou 'Faz sentido para você?'";
      }

      const promptText = `Você é um copywriter de alto padrão no mercado imobiliário. Crie um texto para o imóvel com os dados: Tipo: ${details.propertyType || 'Imóvel'}, Bairro: ${details.neighborhood || 'Não informado'}, Quartos: ${details.bedrooms || 'Não informado'}, Vagas: ${details.parking || 'Não informado'}, Preço: ${details.price || 'Não informado'}, Diferenciais: [${diffsStr}]. ${regrasDeFormato} O Tom do texto deve ser: ${targetAudience}. Adicione CTA para este WhatsApp: ${details.whatsapp || (applyBrandKit ? brandKit?.whatsapp : '') || ''}. Não invente dados.`;

      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro na API');
      }

      const result = await response.json();
      setGeneratedCaption(result.caption);
    } catch (error: any) {
      console.error('ERRO DETALHADO DA API:', error);
      alert('Erro ao gerar copy: ' + (error.message || JSON.stringify(error)));
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  """
    content = before + new_logic + after
    
    # Let's also remove import { GoogleGenerativeAI } from "@google/genai" if it's there
    content = re.sub(r"import\s*\{\s*GoogleGenerativeAI\s*\}\s*from\s*['\"]@google/genai['\"];?\n?", "", content)

    with open('src/App.tsx', 'w') as f:
        f.write(content)
        print("Updated App.tsx gemini")
