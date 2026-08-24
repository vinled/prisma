const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "✨ Gerar Copy com IA (Pro)",
  "✨ Gerar Copy com IA"
);

fs.writeFileSync('src/App.tsx', code);
