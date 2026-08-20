const fs = require('fs');

let code = fs.readFileSync('src/components/ImageUploader.tsx', 'utf8');
code = code.replace(
  'const validFiles = processedFiles.filter((f): f !== null => f !== null);',
  'const validFiles = processedFiles.filter(f => f !== null);'
);

fs.writeFileSync('src/components/ImageUploader.tsx', code);
