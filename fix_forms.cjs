const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/className="grid grid-cols-1 md:grid-cols-1 gap-4"/g, 'className="grid grid-cols-1 md:grid-cols-2 gap-4"');
  content = content.replace(/className="grid grid-cols-2 md:grid-cols-3 gap-4"/g, 'className="grid grid-cols-1 md:grid-cols-3 gap-4"');
  content = content.replace(/className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2"/g, 'className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2"');
  fs.writeFileSync(file, content);
}

fix('src/components/PropertyForm.tsx');
fix('src/components/BrandKitForm.tsx');
console.log('Fixed grids');
