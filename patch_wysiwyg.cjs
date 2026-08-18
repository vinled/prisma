const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace import
code = code.replace(
  "import domtoimage from 'dom-to-image-more';",
  "import * as htmlToImage from 'html-to-image';"
);

// Remove the if (scale > 1) scale = 1; constraint so it perfectly fits any container width
code = code.replace(
  "let scale = containerWidth / 1080;\n        if (scale > 1) scale = 1;\n        setPreviewScale(scale);",
  "let scale = containerWidth / 1080;\n        setPreviewScale(scale);"
);

// Replace previewContainer wrapper
code = code.replace(
  /<div ref=\{previewContainerRef\} className=\{`w-full max-w-\[540px\] h-auto \$\{aspectRatio === 'story' \? 'aspect-\[9\/16\]' : 'aspect-square'\} relative overflow-hidden flex items-center justify-center mx-auto`\}>/g,
  "<div ref={previewContainerRef} className={`w-full relative overflow-hidden ${aspectRatio === 'story' ? 'aspect-[9/16]' : 'aspect-square'}`}>"
);

// Fix inner previewRef style transform
code = code.replace(
  "transform: `scale(${previewScale})`,\n                      transformOrigin: 'top left',",
  "transform: `scale(${previewScale})`,\n                      transformOrigin: 'top left',"
);

// In handleDownload, change domtoimage to htmlToImage
code = code.replace(
  /await domtoimage\.toPng/g,
  "await htmlToImage.toPng"
);

fs.writeFileSync('src/App.tsx', code);
