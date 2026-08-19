const fs = require('fs');
let code = fs.readFileSync('src/components/ImageUploader.tsx', 'utf8');

code = code.replace(
  'const objectUrl = URL.createObjectURL(file);\n        newImagesUrls.push(objectUrl);',
  '// Instant preview\n        // const objectUrl = URL.createObjectURL(file);\n        // newImagesUrls.push(objectUrl);'
);

code = code.replace(
  "const { data } = supabase.storage.from('fotos_imoveis').getPublicUrl(filePath);",
  "const { data } = supabase.storage.from('fotos_imoveis').getPublicUrl(filePath);\n        newImagesUrls.push(data.publicUrl);"
);

// add crossOrigin to the img tag in ImageUploader
code = code.replace(
  '<img src={image} alt={`Imóvel ${index + 1}`} className="w-full h-full object-cover" />',
  '<img src={image} alt={`Imóvel ${index + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />'
);

fs.writeFileSync('src/components/ImageUploader.tsx', code);
