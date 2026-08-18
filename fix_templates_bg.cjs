const fs = require('fs');
const path = require('path');
const templatesDir = path.join(__dirname, 'src', 'templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('Template.tsx'));

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(
    /<img\s+src=\{image\}\s+alt="Imóvel"\s+className="absolute inset-0 w-full h-full object-cover"\s+style=\{\{\s*objectPosition:\s*`\$\{imagePositionX\}%\s*center`\s*\}\}\s*\/>/g,
    `<div 
          className="absolute inset-0 w-full h-full" 
          style={{ 
            backgroundImage: \`url(\${image})\`, 
            backgroundSize: 'cover', 
            backgroundPosition: \`\${imagePositionX}% center\` 
          }}
        />`
  );

  fs.writeFileSync(filePath, content);
}
