const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// add import
code = code.replace(
  "import { Auth } from './components/Auth';",
  "import { Auth } from './components/Auth';\nimport { ResetPassword } from './components/ResetPassword';"
);

// add basic routing for reset-password
const authCheck = `  if (!session) {
    return <Auth />;
  }`;

const authCheckWithReset = `  if (window.location.pathname === '/reset-password') {
    return <ResetPassword />;
  }

  if (!session) {
    return <Auth />;
  }`;

code = code.replace(authCheck, authCheckWithReset);

fs.writeFileSync('src/App.tsx', code);
