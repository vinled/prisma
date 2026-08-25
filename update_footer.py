import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<a href="#" className="hover:text-orange-500 transition-colors">Termos de Uso</a>',
    '<a href="/termos" className="hover:text-orange-500 transition-colors">Termos de Uso</a>'
)

content = content.replace(
    '<a href="#" className="hover:text-orange-500 transition-colors">Política de Privacidade</a>',
    '<a href="/privacidade" className="hover:text-orange-500 transition-colors">Política de Privacidade</a>'
)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
