const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src', 'templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix price wrapping
  // e.g., <div className={`${aspectRatio === 'story' ? 'text-6xl mb-1' : 'text-5xl'} font-black text-white tracking-tighter drop-shadow-md`}>
  //       {details.price}
  //     </div>
  content = content.replace(
    /(<div[^>]*?>)\s*\{details\.price\}\s*<\/div>/g,
    (match, divOpen) => {
      if (!divOpen.includes('whitespace-nowrap')) {
         return divOpen.replace('className="', 'className="whitespace-nowrap ').replace("className={`", "className={`whitespace-nowrap ") + '\n              {details.price}\n            </div>';
      }
      return match;
    }
  );

  fs.writeFileSync(filePath, content);
}

console.log('Fixed whitespace in price.');
