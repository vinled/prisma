const fs = require('fs');

const code = `import { useState, useEffect } from 'react';

export function useSafeImage(url: string | null | undefined): string | null | undefined {
  const [safeUrl, setSafeUrl] = useState<string | null | undefined>(url);

  useEffect(() => {
    if (!url) {
      setSafeUrl(url);
      return;
    }

    let isMounted = true;
    const img = new window.Image();
    
    // Conditional CORS: only apply if external
    if (url.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      if (!isMounted) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0);
          // High-quality JPEG to preserve fidelity without the Base64 bloat of PNG
          setSafeUrl(canvas.toDataURL('image/jpeg', 0.95));
        } else {
          setSafeUrl(url);
        }
      } catch (e) {
        // Tainted canvas or other issue, fallback to original URL
        setSafeUrl(url);
      }
    };

    img.onerror = (e) => {
      console.error('Error loading image with CORS:', e);
      if (isMounted) setSafeUrl(url);
    };

    // Cache busting only for external URLs
    if (url.startsWith('http')) {
      const cleanUrl = url.split('?')[0];
      img.src = \`\${cleanUrl}?t=\${Date.now()}\`;
    } else {
      img.src = url; // Pass local URLs (blob/data) cleanly
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  return safeUrl;
}
`;

fs.writeFileSync('src/hooks/useSafeImage.ts', code);
