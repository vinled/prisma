const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'className="lg:col-span-5 space-y-8 order-2 lg:order-1"',
  'className="lg:col-span-5 space-y-8 order-2 lg:order-1 min-w-0 w-full max-w-full"'
);

content = content.replace(
  'className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full space-y-6"',
  'className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full space-y-6 min-w-0"'
);

fs.writeFileSync('src/App.tsx', content);
console.log('min-w-0 added');
