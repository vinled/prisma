const fs = require('fs');

let code = fs.readFileSync('src/components/MyAccount.tsx', 'utf8');

code = code.replace(
  "style={{ width: \\`\\${progressPercent}%\\` }}",
  "style={{ width: `${progressPercent}%` }}"
);

fs.writeFileSync('src/components/MyAccount.tsx', code);
