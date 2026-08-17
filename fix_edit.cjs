const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'const handleEdit = (prop: SavedProperty) => {',
  `const handleEdit = (prop: SavedProperty) => {
    setPreviewIndex(0);
    setImages(prop.thumbnail ? [prop.thumbnail] : []);`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed handleEdit');
