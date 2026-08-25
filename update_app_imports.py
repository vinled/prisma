with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { LandingPage } from './components/LandingPage';",
    "import { LandingPage } from './components/LandingPage';\nimport { TermosDeUso } from './components/TermosDeUso';\nimport { PoliticaPrivacidade } from './components/PoliticaPrivacidade';"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
