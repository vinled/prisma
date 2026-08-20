const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSafeImage.ts', 'utf8');

code = code.replace(
  'canvas.width = img.width;',
  'canvas.width = img.naturalWidth;'
);

code = code.replace(
  'canvas.height = img.height;',
  'canvas.height = img.naturalHeight;'
);

code = code.replace(
  'const ctx = canvas.getContext(\'2d\');\n        if (ctx) {',
  'const ctx = canvas.getContext(\'2d\');\n        if (ctx) {\n          ctx.imageSmoothingEnabled = true;\n          ctx.imageSmoothingQuality = "high";'
);

fs.writeFileSync('src/hooks/useSafeImage.ts', code);
