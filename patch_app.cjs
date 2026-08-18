const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const containerWidth = entry.contentRect.width;\n        let scale = containerWidth / 540;',
  'const containerWidth = entry.contentRect.width;\n        let scale = containerWidth / 1080;'
);

code = code.replace(
  "width: '540px', \n                      height: aspectRatio === 'story' ? '960px' : '540px',",
  "width: '1080px', \n                      height: aspectRatio === 'story' ? '1920px' : '1080px',"
);

code = code.replace(
  "const scale = 2; // Export at 2x resolution\n      const baseWidth = 540;\n      const baseHeight = aspectRatio === 'story' ? 960 : 540;",
  "const scale = 1; // Export at 1x resolution because base is 1080px\n      const baseWidth = 1080;\n      const baseHeight = aspectRatio === 'story' ? 1920 : 1080;"
);

code = code.replace(
  "width: '540px', \n              height: aspectRatio === 'story' ? '960px' : '540px',",
  "width: '1080px', \n              height: aspectRatio === 'story' ? '1920px' : '1080px',"
);

fs.writeFileSync('src/App.tsx', code);
