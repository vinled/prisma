import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_prompt_code = """      const promptText = `Você é um copywriter de alto padrão no mercado imobiliário. Crie um texto para o imóvel com os dados: Tipo: ${details.propertyType || 'Imóvel'}, Bairro: ${details.neighborhood || 'Não informado'}, Quartos: ${details.bedrooms || 'Não informado'}, Vagas: ${details.parking || 'Não informado'}, Preço: ${details.price || 'Não informado'}, Diferenciais: [${diffsStr}]. ${regrasDeFormato} O Tom do texto deve ser: ${targetAudience}. Adicione CTA para este WhatsApp: ${details.whatsapp || (applyBrandKit ? brandKit?.whatsapp : '') || ''}. Não invente dados.`;"""

new_prompt_code = """      let instructionPurpose = '';
      let precoPrompt = `Preço: ${details.price || 'Não informado'}`;
      
      if (details.purpose === 'locacao') {
        instructionPurpose = 'Se a finalidade for LOCAÇÃO, crie chamadas para ação focadas em aluguel, mudança rápida e estilo de vida. NUNCA use palavras como comprar, investir ou aquisição.';
        precoPrompt = `Aluguel: ${details.rent_price || 'Não informado'}, Condomínio: ${details.condo_price || '0'}, IPTU: ${details.iptu_price || '0'} (Pacote: ${details.is_package ? 'Sim' : 'Não'})`;
      } else {
        instructionPurpose = 'Se for VENDA, foque em compra e investimento.';
      }

      const promptText = `Você é um copywriter de alto padrão no mercado imobiliário. Crie um texto para o imóvel com os dados: Finalidade: ${details.purpose || 'venda'}, Tipo: ${details.propertyType || 'Imóvel'}, Bairro: ${details.neighborhood || 'Não informado'}, Quartos: ${details.bedrooms || 'Não informado'}, Vagas: ${details.parking || 'Não informado'}, ${precoPrompt}, Diferenciais: [${diffsStr}]. ${regrasDeFormato} O Tom do texto deve ser: ${targetAudience}. ${instructionPurpose} Adicione CTA para este WhatsApp: ${details.whatsapp || (applyBrandKit ? brandKit?.whatsapp : '') || ''}. Não invente dados.`;"""

if old_prompt_code in content:
    content = content.replace(old_prompt_code, new_prompt_code)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Patched App.tsx prompt generation")
else:
    print("Could not find prompt generation code")
