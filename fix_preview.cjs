const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace ResizeObserver logic
const oldObserver = `  useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        let scale = containerWidth / 1080;
        setPreviewScale(scale);
      }
    });
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);`;

const newObserver = `  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.getBoundingClientRect().width;
        // The container has p-4 (16px padding on each side), so subtract 32px for the actual content area
        const contentWidth = containerWidth - 32;
        let scale = contentWidth / 1080;
        if (scale <= 0) scale = 0.1;
        setPreviewScale(scale);
      }
    };
    
    updateScale(); // Initial call
    
    const observer = new ResizeObserver(() => {
      updateScale();
    });
    
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    
    window.addEventListener('resize', updateScale);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [images.length]); // Re-run if images change, just in case layout shifts`;

code = code.replace(oldObserver, newObserver);

fs.writeFileSync('src/App.tsx', code);
