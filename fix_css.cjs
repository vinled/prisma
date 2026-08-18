const fs = require('fs');
const path = require('path');
const templatesDir = path.join(__dirname, 'src', 'templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('Template.tsx'));

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\]\.5/g, ']');
  fs.writeFileSync(filePath, content);
}
