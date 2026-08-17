const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix main wrapper h-screen
content = content.replace(
  'className="flex flex-col md:flex-row h-screen bg-gray-50',
  'className="flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-50'
);

// Check lg:grid-cols-[1fr_1.5fr] as the user requested:
// "Use md:grid-cols-2 ou lg:grid-cols-[1fr_1.5fr] para colocá-los lado a lado novamente apenas no computador."
content = content.replace(
  'className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-full"',
  'className="flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12 w-full max-w-full"'
);

// Since we changed to 1fr_1.5fr, we shouldn't use col-span-5 and col-span-7
content = content.replace(
  'className="lg:col-span-5 space-y-8 order-2 lg:order-1 min-w-0 w-full max-w-full"',
  'className="space-y-8 order-2 lg:order-1 min-w-0 w-full max-w-full"'
);

content = content.replace(
  'className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full space-y-6 min-w-0"',
  'className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full space-y-6 min-w-0"'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App wrapper and grid fixed.');
