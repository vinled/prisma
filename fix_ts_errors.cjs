const fs = require('fs');

['src/templates/ElegantTemplate.tsx', 'src/templates/LuxuryTemplate.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/details\.code/g, 'details.propertyCode');
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed TS errors.');
