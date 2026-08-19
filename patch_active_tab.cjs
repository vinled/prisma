const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update state type for activeTab
code = code.replace(
  "useState<'criacao' | 'meus_imoveis' | 'minha_marca'>",
  "useState<'criacao' | 'meus_imoveis' | 'minha_marca' | 'minha_conta'>"
);

// 2. Import User icon for the sidebar
code = code.replace(
  "import { Download, Layout, Moon, Sun, Copy, Check, LogOut } from 'lucide-react';",
  "import { Download, Layout, Moon, Sun, Copy, Check, LogOut, User } from 'lucide-react';"
);

// 3. Import the MyAccount component
code = code.replace(
  "import { GoogleGenerativeAI } from '@google/generative-ai';",
  "import { GoogleGenerativeAI } from '@google/generative-ai';\nimport { MyAccount } from './components/MyAccount';"
);

fs.writeFileSync('src/App.tsx', code);
