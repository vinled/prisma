const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const dataUrl = stageRef.current.toDataURL({ pixelRatio: 1 });",
  "const dataUrl = stageRef.current.toDataURL({ pixelRatio: 1 / previewScale });"
);

fs.writeFileSync('src/App.tsx', code);
