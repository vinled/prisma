const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'flex-shrink-0 overflow-hidden bg-gray-100',
  'flex-shrink-0 bg-gray-100'
);

code = code.replace(
  'w-full relative overflow-hidden ${aspectRatio',
  'w-full relative ${aspectRatio'
);

fs.writeFileSync('src/App.tsx', code);
