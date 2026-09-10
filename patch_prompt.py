import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_rule = 'regrasDeFormato = "Formate como um post de Instagram. Use parágrafos curtos, emojis espaçados para leitura fluida, inclua hashtags relevantes no final e crie uma chamada para ação (CTA) convidando para comentar ou enviar direct.";'

new_rule = 'regrasDeFormato = "Formate como um post de Instagram. Use parágrafos curtos e emojis espaçados para leitura fluida. REGRAS ESTRITAS: 1. ZERO formatação Markdown (NÃO use ** ou * para negrito/itálico, gere apenas texto plano). 2. PROIBIDO inserir links, URLs ou placeholders como \'[Insira o link]\' (links não são clicáveis no Instagram). 3. Para chamadas de ação (CTA), use APENAS instruções nativas como \'Link na bio\', \'Envie uma mensagem no Direct\' ou \'Comente EU QUERO\'. 4. Inclua hashtags relevantes no final.";'

if old_rule in content:
    content = content.replace(old_rule, new_rule)
else:
    print("Old rule not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
