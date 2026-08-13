const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldOptionsRegex = /const options = \{\s*width: baseWidth \* scale,\s*height: baseHeight \* scale,\s*style: \{\s*transform: `scale\(\$\{scale\}\)`,\s*transformOrigin: 'top left',\s*width: `\$\{baseWidth\}px`,\s*height: `\$\{baseHeight\}px`\s*\}\s*\};/;

const newOptions = `const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale
      };`;

content = content.replace(oldOptionsRegex, newOptions);

fs.writeFileSync('src/App.tsx', content);
console.log('Export options fixed.');
