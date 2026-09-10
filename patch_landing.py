import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

if 'react-router-dom' not in content:
    content = "import { Link } from 'react-router-dom';\n" + content

content = content.replace('<a href="/termos"', '<Link to="/termos"')
content = content.replace('Termos de Uso</a>', 'Termos de Uso</Link>')

content = content.replace('<a href="/privacidade"', '<Link to="/privacidade"')
content = content.replace('Política de Privacidade</a>', 'Política de Privacidade</Link>')

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
