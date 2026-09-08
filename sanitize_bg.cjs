const fs = require('fs');

const files = [
  'src/templates/ElegantTemplate.tsx', 
  'src/templates/ModernTemplate.tsx', 
  'src/templates/LuxuryTemplate.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/backgroundImage:\s*`url\(\$\{image\}\)`/g, 'backgroundImage: `url("${image?.replace(/\\"/g, \'\')}")`');
  fs.writeFileSync(file, content);
});
