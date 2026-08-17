const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
content = content.replace(
  "import { Download, Layout, Moon, Sun, Copy, Check } from 'lucide-react';",
  "import { Download, Layout, Moon, Sun, Copy, Check, LogOut } from 'lucide-react';\nimport { supabase } from './lib/supabase';\nimport { Auth } from './components/Auth';\nimport { Session } from '@supabase/supabase-js';"
);

// State
content = content.replace(
  "export default function App() {\n  const [activeTab, setActiveTab]",
  "export default function App() {\n  const [session, setSession] = useState<Session | null>(null);\n  const [activeTab, setActiveTab]"
);

// useEffect for auth
const authEffect = `
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

`;

content = content.replace(
  "return (\n    <div className=",
  authEffect + "  return (\n    <div className="
);

// Sidebar Mobile Logout
content = content.replace(
  /<div className="md:hidden">([\s\S]*?)<\/div>/,
  `<div className="md:hidden flex items-center gap-2">
$1
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>`
);

// Sidebar Desktop Logout
content = content.replace(
  /<div className="hidden md:block p-4 border-t border-gray-200 dark:border-zinc-800">([\s\S]*?)<\/div>/,
  `<div className="hidden md:flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-zinc-800">
$1
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </button>
        </div>`
);

fs.writeFileSync('src/App.tsx', content);
console.log('App updated with Supabase Auth');
