const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src', 'templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix whatsapp span
  content = content.replace(
    /<span className=\{`font-medium \$\{aspectRatio === 'story' \? 'text-lg' : 'text-sm'\} tracking-wide`\}>\{whatsapp\}<\/span>/g,
    `<span className={\`font-medium \${aspectRatio === 'story' ? 'text-lg' : 'text-sm'} tracking-wide whitespace-nowrap\`}>{whatsapp}</span>`
  );
  
  // Alternative whatsapp span (sometimes it might be different in other templates)
  content = content.replace(
    /\{whatsapp\}\s*<\/span>/g,
    '{whatsapp}</span>' // just a normal check, let's do a more robust regex if needed
  );
  
  // We can just add whitespace-nowrap to all whatsapp spans:
  content = content.replace(
    /(<span[^>]*?>\{whatsapp\}<\/span>)/g,
    (match) => {
      if (!match.includes('whitespace-nowrap')) {
         return match.replace('className="', 'className="whitespace-nowrap ').replace("className={`", "className={`whitespace-nowrap ");
      }
      return match;
    }
  );

  // Fix features span
  content = content.replace(
    /(<span[^>]*?>\{feat\.label\}<\/span>)/g,
    (match) => {
      if (!match.includes('whitespace-nowrap')) {
         return match.replace('className="', 'className="whitespace-nowrap ').replace("className={`", "className={`whitespace-nowrap ");
      }
      return match;
    }
  );
  
  // Fix tags string? tags might need wrapping, but maybe they shouldn't wrap arbitrarily.
  // Actually the tags string should probably be able to wrap if it's too long, but if we don't want words to break, `break-words` or standard wrap is fine. Wait, the screenshot shows "Decorado • Pé na areia • Sol da manhã • Aceita pet •\nReformado". That's a normal wrap.
  // The screenshot shows WhatsApp breaking in the middle: "(13)\n3222-1818".
  // The screenshot shows features breaking: "120\nm2" and "4\nDorm".
  
  fs.writeFileSync(filePath, content);
}

console.log('Fixed whitespace in templates.');
