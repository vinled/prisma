const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<MyAccount session={session} />',
  '<MyAccount session={session} brandKit={brandKit} />'
);

fs.writeFileSync('src/App.tsx', code);
