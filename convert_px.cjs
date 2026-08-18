const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src', 'templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('Template.tsx'));

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove @container
  content = content.replace(/ @container/g, '');
  content = content.replace(/@container/g, '');

  // Convert [Xcqw] to [Ypx] where Y = X * 10.8
  content = content.replace(/\[([0-9.]+)cqw\]/g, (match, p1) => {
    const val = parseFloat(p1);
    const px = Math.round(val * 10.8);
    return `[${px}px]`;
  });

  fs.writeFileSync(filePath, content);
}
