const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'className={`w-full h-auto ${aspectRatio === \'story\' ? \'aspect-[9/16]\' : \'aspect-square\'} relative overflow-hidden flex items-center justify-center`}',
  'className={`w-full max-w-[540px] h-auto ${aspectRatio === \'story\' ? \'aspect-[9/16]\' : \'aspect-square\'} relative overflow-hidden flex items-center justify-center mx-auto`}'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed max width');
