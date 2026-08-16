const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const effectCode = `
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        let scale = containerWidth / 540;
        if (scale > 1) scale = 1;
        setPreviewScale(scale);
      }
    });
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);
`;

// Insert after the declaration of hiddenRenderersRef
content = content.replace(
  'const hiddenRenderersRef = useRef<HTMLDivElement>(null);',
  'const hiddenRenderersRef = useRef<HTMLDivElement>(null);\n' + effectCode
);

fs.writeFileSync('src/App.tsx', content);
console.log('Scale effect added.');
