const fs = require('fs');
let code = fs.readFileSync('src/components/ImageUploader.tsx', 'utf8');

code = code.replace(
  'crossOrigin="anonymous"',
  ''
);

fs.writeFileSync('src/components/ImageUploader.tsx', code);
