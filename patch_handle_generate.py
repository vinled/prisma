import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_block = """  const handleGenerateCopy = async () => {
    if (userPlan !== 'pro') {
      alert('Recurso exclusivo do Plano Pro. Faça o upgrade para usar a IA!');
      setIsPaywallOpen(true);
      return;
    }
    if (userPlan === 'free' && targetAudience.includes('(Pro)')) {
      setIsPaywallOpen(true);
      return;
    }"""

new_block = """  const handleGenerateCopy = async () => {
    if (userPlan !== 'pro' && targetAudience.includes('(Pro)')) {
      alert('Este tom/estilo é exclusivo do Plano Pro. Faça o upgrade para usá-lo!');
      setIsPaywallOpen(true);
      return;
    }"""

content = content.replace(old_block, new_block)

with open('src/App.tsx', 'w') as f:
    f.write(content)
