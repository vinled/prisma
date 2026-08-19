const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '${details.whatsapp || brandKit?.whatsapp || \'\'}',
  '${details.whatsapp || (applyBrandKit ? brandKit?.whatsapp : \'\') || \'\'}'
);

fs.writeFileSync('src/App.tsx', code);
