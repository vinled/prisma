const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src', 'templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('Template.tsx'));

const replacements = {
  // @container
  'id="post-template"': 'id="post-template" className="@container"', // wait, they already have className
};

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add @container to root div
  // The root div usually has className="relative w-full h-full bg-xxx overflow-hidden font-sans" id="post-template"
  if (!content.includes('@container')) {
    content = content.replace(/className="([^"]+w-full h-full[^"]+)"/, 'className="$1 @container"');
  }

  // paddings
  content = content.replace(/\bp-3\b/g, 'p-[2cqw]');
  content = content.replace(/\bp-4\b/g, 'p-[3cqw]');
  content = content.replace(/\bp-5\b/g, 'p-[4cqw]');
  content = content.replace(/\bp-6\b/g, 'p-[5cqw]');
  content = content.replace(/\bp-8\b/g, 'p-[6cqw]');
  content = content.replace(/\bp-10\b/g, 'p-[8cqw]');
  content = content.replace(/\bp-12\b/g, 'p-[10cqw]');

  content = content.replace(/\bpx-3\b/g, 'px-[2cqw]');
  content = content.replace(/\bpx-4\b/g, 'px-[3cqw]');
  content = content.replace(/\bpx-5\b/g, 'px-[4cqw]');
  content = content.replace(/\bpx-6\b/g, 'px-[5cqw]');
  content = content.replace(/\bpx-8\b/g, 'px-[6cqw]');

  content = content.replace(/\bpy-1\.5\b/g, 'py-[1.2cqw]');
  content = content.replace(/\bpy-2\b/g, 'py-[1.5cqw]');
  content = content.replace(/\bpy-2\.5\b/g, 'py-[2cqw]');
  content = content.replace(/\bpy-3\b/g, 'py-[2.5cqw]');

  content = content.replace(/\bpt-2\b/g, 'pt-[1.5cqw]');
  content = content.replace(/\bpt-3\b/g, 'pt-[2cqw]');
  content = content.replace(/\bpb-3\b/g, 'pb-[2cqw]');
  content = content.replace(/\bpb-8\b/g, 'pb-[6cqw]');
  content = content.replace(/\bpl-4\b/g, 'pl-[3cqw]');
  
  // margins
  content = content.replace(/\bmb-1\b/g, 'mb-[0.8cqw]');
  content = content.replace(/\bmb-1\.5\b/g, 'mb-[1.2cqw]');
  content = content.replace(/\bmb-2\b/g, 'mb-[1.5cqw]');
  content = content.replace(/\bmb-3\b/g, 'mb-[2cqw]');
  content = content.replace(/\bmb-4\b/g, 'mb-[3cqw]');
  content = content.replace(/\bmb-6\b/g, 'mb-[5cqw]');
  content = content.replace(/\bmb-8\b/g, 'mb-[6cqw]');
  
  content = content.replace(/\bmt-1\b/g, 'mt-[0.8cqw]');
  content = content.replace(/\bmt-1\.5\b/g, 'mt-[1.2cqw]');
  content = content.replace(/\bmt-2\b/g, 'mt-[1.5cqw]');
  content = content.replace(/\bmt-2\.5\b/g, 'mt-[2cqw]');
  content = content.replace(/\bmt-3\b/g, 'mt-[2cqw]');
  content = content.replace(/\bmt-4\b/g, 'mt-[3cqw]');
  content = content.replace(/\bmt-auto\b/g, 'mt-auto');
  
  content = content.replace(/\bmr-1\b/g, 'mr-[0.8cqw]');
  content = content.replace(/\bmr-1\.5\b/g, 'mr-[1.2cqw]');
  content = content.replace(/\bmr-2\b/g, 'mr-[1.5cqw]');
  content = content.replace(/\bmr-3\b/g, 'mr-[2cqw]');
  content = content.replace(/\bmr-4\b/g, 'mr-[3cqw]');
  
  content = content.replace(/\bml-auto\b/g, 'ml-auto');
  
  // gaps
  content = content.replace(/\bgap-1\b/g, 'gap-[0.8cqw]');
  content = content.replace(/\bgap-1\.5\b/g, 'gap-[1.2cqw]');
  content = content.replace(/\bgap-2\b/g, 'gap-[1.5cqw]');
  content = content.replace(/\bgap-3\b/g, 'gap-[2cqw]');
  content = content.replace(/\bgap-4\b/g, 'gap-[3cqw]');
  content = content.replace(/\bgap-5\b/g, 'gap-[4cqw]');
  content = content.replace(/\bgap-6\b/g, 'gap-[5cqw]');
  content = content.replace(/\bgap-8\b/g, 'gap-[6cqw]');

  // top/left/right/bottom
  content = content.replace(/\btop-8\b/g, 'top-[6cqw]');
  content = content.replace(/\bleft-8\b/g, 'left-[6cqw]');
  content = content.replace(/\bright-8\b/g, 'right-[6cqw]');
  content = content.replace(/\bbottom-8\b/g, 'bottom-[6cqw]');

  content = content.replace(/\btop-4\b/g, 'top-[3cqw]');
  content = content.replace(/\bleft-4\b/g, 'left-[3cqw]');
  content = content.replace(/\bright-4\b/g, 'right-[3cqw]');
  content = content.replace(/\bbottom-4\b/g, 'bottom-[3cqw]');
  
  content = content.replace(/\btop-6\b/g, 'top-[4.5cqw]');
  content = content.replace(/\bleft-6\b/g, 'left-[4.5cqw]');
  content = content.replace(/\bright-6\b/g, 'right-[4.5cqw]');
  content = content.replace(/\bbottom-6\b/g, 'bottom-[4.5cqw]');

  // space-x
  content = content.replace(/\bspace-x-1\b/g, 'space-x-[0.8cqw]');
  content = content.replace(/\bspace-x-2\b/g, 'space-x-[1.5cqw]');
  content = content.replace(/\bspace-x-3\b/g, 'space-x-[2cqw]');
  
  // dimensions
  content = content.replace(/\bw-3\b/g, 'w-[2.5cqw]');
  content = content.replace(/\bh-3\b/g, 'h-[2.5cqw]');
  content = content.replace(/\bw-3\.5\b/g, 'w-[2.8cqw]');
  content = content.replace(/\bh-3\.5\b/g, 'h-[2.8cqw]');
  content = content.replace(/\bw-4\b/g, 'w-[3cqw]');
  content = content.replace(/\bh-4\b/g, 'h-[3cqw]');
  content = content.replace(/\bw-5\b/g, 'w-[4cqw]');
  content = content.replace(/\bh-5\b/g, 'h-[4cqw]');
  content = content.replace(/\bw-6\b/g, 'w-[4.5cqw]');
  content = content.replace(/\bh-6\b/g, 'h-[4.5cqw]');
  content = content.replace(/\bw-7\b/g, 'w-[5cqw]');
  content = content.replace(/\bh-7\b/g, 'h-[5cqw]');
  content = content.replace(/\bw-8\b/g, 'w-[6cqw]');
  content = content.replace(/\bh-8\b/g, 'h-[6cqw]');
  content = content.replace(/\bw-10\b/g, 'w-[8cqw]');
  content = content.replace(/\bh-10\b/g, 'h-[8cqw]');
  
  content = content.replace(/\bw-\[24px\]/g, 'w-[5cqw]');
  content = content.replace(/\bh-\[24px\]/g, 'h-[5cqw]');
  
  // specific max-h/w
  content = content.replace(/\bmax-h-\[46px\]/g, 'max-h-[8cqw]');
  content = content.replace(/\bmax-h-\[50px\]/g, 'max-h-[8.5cqw]');
  content = content.replace(/\bmax-h-\[60px\]/g, 'max-h-[10cqw]');
  content = content.replace(/\bmax-h-\[70px\]/g, 'max-h-[12cqw]');
  content = content.replace(/\bmax-h-\[80px\]/g, 'max-h-[14cqw]');
  content = content.replace(/\bmax-h-12\b/g, 'max-h-[10cqw]');
  
  content = content.replace(/\bmax-w-\[140px\]/g, 'max-w-[30cqw]');
  content = content.replace(/\bmax-w-\[200px\]/g, 'max-w-[40cqw]');

  // text sizes
  content = content.replace(/\btext-xs\b/g, 'text-[2cqw]');
  content = content.replace(/\btext-sm\b/g, 'text-[2.5cqw]');
  content = content.replace(/\btext-base\b/g, 'text-[3cqw]');
  content = content.replace(/\btext-lg\b/g, 'text-[4cqw]');
  content = content.replace(/\btext-xl\b/g, 'text-[4.5cqw]');
  content = content.replace(/\btext-2xl\b/g, 'text-[5.5cqw]');
  content = content.replace(/\btext-3xl\b/g, 'text-[6.5cqw]');
  content = content.replace(/\btext-4xl\b/g, 'text-[7cqw]');
  content = content.replace(/\btext-5xl\b/g, 'text-[8cqw]');
  content = content.replace(/\btext-6xl\b/g, 'text-[10cqw]');
  
  content = content.replace(/\btext-\[9px\]/g, 'text-[1.8cqw]');
  content = content.replace(/\btext-\[10px\]/g, 'text-[2cqw]');
  content = content.replace(/\btext-\[11px\]/g, 'text-[2.2cqw]');
  content = content.replace(/\btext-\[12px\]/g, 'text-[2.5cqw]');
  content = content.replace(/\btext-\[13px\]/g, 'text-[2.8cqw]');
  content = content.replace(/\btext-\[14px\]/g, 'text-[3cqw]');
  content = content.replace(/\btext-\[16px\]/g, 'text-[3.2cqw]');
  content = content.replace(/\btext-\[18px\]/g, 'text-[3.8cqw]');
  content = content.replace(/\btext-\[20px\]/g, 'text-[4.2cqw]');
  content = content.replace(/\btext-\[24px\]/g, 'text-[5cqw]');
  content = content.replace(/\btext-\[28px\]/g, 'text-[6cqw]');
  content = content.replace(/\btext-\[32px\]/g, 'text-[7cqw]');

  // leading
  content = content.replace(/\bleading-none\b/g, 'leading-none'); // ok
  content = content.replace(/\bleading-tight\b/g, 'leading-[1.2]'); 
  content = content.replace(/\bleading-\[1\.1\]/g, 'leading-[1.1]'); 

  // borders / rounded
  content = content.replace(/\brounded-sm\b/g, 'rounded-[1cqw]');
  content = content.replace(/\brounded\b(?!-)/g, 'rounded-[1.5cqw]');
  content = content.replace(/\brounded-md\b/g, 'rounded-[2cqw]');
  content = content.replace(/\brounded-lg\b/g, 'rounded-[2.5cqw]');
  content = content.replace(/\brounded-xl\b/g, 'rounded-[3cqw]');
  content = content.replace(/\brounded-2xl\b/g, 'rounded-[4cqw]');
  content = content.replace(/\brounded-3xl\b/g, 'rounded-[5cqw]');
  // rounded-full is already covered if we want but rounded-full is technically ok as rounded-full, wait.
  // The user said "rounded-lg por rounded-[2cqw]". `rounded-full` uses 9999px, which still works in cqw but `rounded-full` is fine.
  
  // explicit rounded values like rounded-br-[40px]
  content = content.replace(/rounded-br-\[40px\]/g, 'rounded-br-[8cqw]');
  content = content.replace(/rounded-tl-\[40px\]/g, 'rounded-tl-[8cqw]');
  
  content = content.replace(/border-4/g, 'border-[0.8cqw]');
  content = content.replace(/border-2/g, 'border-[0.4cqw]');

  fs.writeFileSync(filePath, content);
}
