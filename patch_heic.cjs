const fs = require('fs');

let code = fs.readFileSync('src/components/ImageUploader.tsx', 'utf8');

code = code.replace(
  'console.error("Erro no heic2any:", error);\n              return null;',
  'console.error("Erro no heic2any:", error);\n              alert("O formato desta foto da Apple não é suportado no navegador. Por favor, converta para JPG ou envie pelo celular.");\n              return null;'
);

code = code.replace(
  'accept="image/jpeg, image/png, image/webp, image/heic, .heic, .HEIC"',
  'accept="image/jpeg, image/png, image/webp"'
);

fs.writeFileSync('src/components/ImageUploader.tsx', code);
