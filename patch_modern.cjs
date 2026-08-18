const fs = require('fs');

let code = fs.readFileSync('src/templates/ModernTemplate.tsx', 'utf8');

// root container
code = code.replace(
  'className="relative w-full h-full bg-zinc-900 overflow-hidden shadow-lg font-sans"',
  'className="relative w-full h-full bg-zinc-900 overflow-hidden shadow-lg font-sans @container"'
);

// padding / margin
code = code.replace(/p-10/g, 'p-[8cqw]');
code = code.replace(/p-8/g, 'p-[6cqw]');
code = code.replace(/px-5 py-2\.5/g, 'px-[4cqw] py-[2cqw]');
code = code.replace(/px-4 py-2/g, 'px-[3cqw] py-[1.5cqw]');
code = code.replace(/px-5 py-2/g, 'px-[4cqw] py-[1.5cqw]');
code = code.replace(/px-4 py-1\.5/g, 'px-[3cqw] py-[1cqw]');
code = code.replace(/gap-5/g, 'gap-[4cqw]');
code = code.replace(/gap-4/g, 'gap-[3cqw]');
code = code.replace(/gap-6/g, 'gap-[5cqw]');
code = code.replace(/gap-1/g, 'gap-[1cqw]');
code = code.replace(/mb-1/g, 'mb-[1cqw]');
code = code.replace(/mt-1/g, 'mt-[1cqw]');
code = code.replace(/mt-2/g, 'mt-[2cqw]');
code = code.replace(/mt-3/g, 'mt-[3cqw]');
code = code.replace(/mr-2/g, 'mr-[1.5cqw]');
code = code.replace(/space-x-2/g, 'space-x-[1.5cqw]');

// sizes
code = code.replace(/max-h-\[70px\]/g, 'max-h-[12cqw]');
code = code.replace(/max-h-\[50px\]/g, 'max-h-[8cqw]');
code = code.replace(/w-6 h-6/g, 'w-[5cqw] h-[5cqw]');
code = code.replace(/w-5 h-5/g, 'w-[4cqw] h-[4cqw]');
code = code.replace(/w-4 h-4/g, 'w-[3cqw] h-[3cqw]');

// typography
code = code.replace(/text-lg/g, 'text-[4cqw]');
code = code.replace(/text-sm/g, 'text-[2.5cqw]');
code = code.replace(/text-base/g, 'text-[3cqw]');
code = code.replace(/text-xs/g, 'text-[2cqw]');
code = code.replace(/text-xl/g, 'text-[4.5cqw]');
code = code.replace(/text-5xl/g, 'text-[8cqw]');
code = code.replace(/text-6xl/g, 'text-[10cqw]');
code = code.replace(/text-\[12px\]/g, 'text-[2.5cqw]');
code = code.replace(/text-\[9px\]/g, 'text-[1.8cqw]');
code = code.replace(/text-\[10px\]/g, 'text-[2cqw]');

// others
code = code.replace(/rounded-full/g, 'rounded-[50cqw]');

fs.writeFileSync('src/templates/ModernTemplate.tsx', code);
